import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Rol } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateShiftTemplateDto } from './dto/create-shift-template.dto';
import { UpdateShiftTemplateDto } from './dto/update-shift-template.dto';

// ─── Caller ────────────────────────────────────────────────
// Campos que llegan desde jwt.strategy.ts → validate()
interface Caller {
  id_usuario:     number;
  nombre:         string;
  email:          string;
  rol:            Rol;
  id_departamento: number | null;
  id_moderador:   number | null;
  acceso_global:  boolean;
}

// ─── Select reutilizable para responses ────────────────────
const CREADOR_SELECT = {
  id_usuario: true,
  nombre:     true,
  email:      true,
  rol:        true,
};

// ─── Helper: "HH:mm" → Date (base 1970-01-01, UTC) ────────
// Prisma @db.Time() espera un objeto Date; usamos la época Unix como fecha base.
function parseHHmm(hhmm: string): Date {
  const [hours, minutes] = hhmm.split(':').map(Number);
  const d = new Date(0); // 1970-01-01T00:00:00.000Z
  d.setUTCHours(hours, minutes, 0, 0);
  return d;
}

@Injectable()
export class ShiftTemplatesService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── GUARD INTERNO: solo SA o ADM Global puede escribir ──
  private assertPuedeEscribir(caller: Caller): void {
    if (caller.rol === Rol.SA) return; // SA siempre puede

    if (caller.rol === Rol.ADM && caller.acceso_global) return; // ADM Global puede

    // ADM Depto u otros roles → denegado
    throw new ForbiddenException(
      'Solo un Administrador Global puede crear, editar o eliminar plantillas de turno.',
    );
  }

  // ─── GUARD INTERNO: hora_fin > hora_inicio ───────────────
  // RN-CST-002: no se permiten turnos que crucen medianoche en MVP
  private assertHoraFinMayorQueInicio(inicio: Date, fin: Date): void {
    if (fin <= inicio) {
      throw new BadRequestException(
        'hora_fin debe ser posterior a hora_inicio. ' +
        'Los turnos que cruzan medianoche no están soportados en esta versión.',
      );
    }
  }

  // ─── FIND ALL ──────────────────────────────────────────────
  async findAll() {
    return this.prisma.plantillaTurno.findMany({
      include: { creador: { select: CREADOR_SELECT } },
      orderBy: [{ activa: 'desc' }, { hora_inicio: 'asc' }],
    });
  }

  // ─── FIND ONE ──────────────────────────────────────────────
  async findOne(id: number) {
    const plantilla = await this.prisma.plantillaTurno.findUnique({
      where:   { id_plantilla: id },
      include: { creador: { select: CREADOR_SELECT } },
    });
    if (!plantilla) {
      throw new NotFoundException(`Plantilla de turno con ID ${id} no encontrada.`);
    }
    return plantilla;
  }

  // ─── CREATE ───────────────────────────────────────────────
  async create(dto: CreateShiftTemplateDto, caller: Caller) {
    this.assertPuedeEscribir(caller);

    const horaInicio = parseHHmm(dto.hora_inicio);
    const horaFin    = parseHHmm(dto.hora_fin);
    this.assertHoraFinMayorQueInicio(horaInicio, horaFin);

    return this.prisma.plantillaTurno.create({
      data: {
        nombre:      dto.nombre.trim(),
        hora_inicio: horaInicio,
        hora_fin:    horaFin,
        activa:      dto.activa ?? true,
        id_creador:  caller.id_usuario,
      },
      include: { creador: { select: CREADOR_SELECT } },
    });
  }

  // ─── UPDATE ───────────────────────────────────────────────
  async update(id: number, dto: UpdateShiftTemplateDto, caller: Caller) {
    this.assertPuedeEscribir(caller);

    // ✅ Patrón B2: capturar before antes de aplicar cambios
    const before = await this.findOne(id);

    // Resolver horas: usar las del DTO si vienen, si no las del registro actual
    const horaInicio = dto.hora_inicio
      ? parseHHmm(dto.hora_inicio)
      : before.hora_inicio;

    const horaFin = dto.hora_fin
      ? parseHHmm(dto.hora_fin)
      : before.hora_fin;

    // Validar constraint incluso en actualizaciones parciales
    this.assertHoraFinMayorQueInicio(horaInicio, horaFin);

    const after = await this.prisma.plantillaTurno.update({
      where: { id_plantilla: id },
      data: {
        ...(dto.nombre      !== undefined && { nombre:      dto.nombre.trim() }),
        ...(dto.hora_inicio !== undefined && { hora_inicio: horaInicio }),
        ...(dto.hora_fin    !== undefined && { hora_fin:    horaFin }),
        ...(dto.activa      !== undefined && { activa:      dto.activa }),
      },
      include: { creador: { select: CREADOR_SELECT } },
    });

    return { before, after };
  }

  // ─── REMOVE ───────────────────────────────────────────────
  // En MVP no existe FK entre Turno y PlantillaTurno — eliminación directa segura.
  // Cuando se implemente la asignación de plantillas a turnos, revisar este método.
  async remove(id: number, caller: Caller) {
    this.assertPuedeEscribir(caller);
    await this.findOne(id); // Lanza 404 si no existe
    return this.prisma.plantillaTurno.delete({ where: { id_plantilla: id } });
  }
}

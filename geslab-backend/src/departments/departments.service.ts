import { ConflictException, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { buildPaginatedResponse } from 'src/common/interfaces/paginated-response.interface';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';


@Injectable()
export class DepartmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(dto: PaginationDto) {
    const { page = 1, limit = 20, search } = dto;
    const skip = (page - 1) * limit;
    const where = search
      ? { nombre: { contains: search, mode: 'insensitive' as const } }
      : {};
    const [data, total] = await this.prisma.$transaction([
      this.prisma.departamento.findMany({
        where,
        include: {
          usuarios: {
            where: { activo: true },
            select: { id_usuario: true, nombre: true, email: true, rol: true },
          },
        },
        skip,
        take: limit,
      }),
      this.prisma.departamento.count({ where }),
    ]);
    return buildPaginatedResponse(data, total, page, limit);
  }

  async findOne(id: number) {
    const dept = await this.prisma.departamento.findUnique({
      where: { id_departamento: id },
      include: {
        usuarios: {
          where: { activo: true },
          select: { id_usuario: true, nombre: true, email: true, rol: true },
        },
      },
    });
    if (!dept) throw new NotFoundException(`Departamento ${id} no encontrado`);
    return dept;
  }

  async create(dto: CreateDepartmentDto) {
    return this.prisma.departamento.create({ data: { nombre: dto.nombre } });
  }

  async update(id: number, dto: UpdateDepartmentDto) {
    await this.findOne(id);
    return this.prisma.departamento.update({
      where: { id_departamento: id },
      data: { nombre: dto.nombre },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    const activeUsers = await this.prisma.usuario.count({
      where: { id_departamento: id, activo: true },
    });
    if (activeUsers > 0) {
      throw new ConflictException(
        `No se puede eliminar: el departamento tiene ${activeUsers} usuario(s) activo(s)`,
      );
    }
    return this.prisma.departamento.delete({ where: { id_departamento: id } });
  }
}

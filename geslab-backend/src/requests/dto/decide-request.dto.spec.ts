import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { DecideRequestDto, DecisionEstado } from './decide-request.dto';

describe('DecideRequestDto', () => {
  // ─── CASOS VÁLIDOS ────────────────────────────────────────

  it('acepta comentario de texto libre con puntuación al Rechazar', async () => {
    const dto = plainToInstance(DecideRequestDto, {
      estado: DecisionEstado.Rechazada,
      comentario: 'Se rechaza por falta de personal.',
    });
    expect(await validate(dto)).toHaveLength(0);
  });

  it('acepta comentario con fecha y horario al Aprobar', async () => {
    const dto = plainToInstance(DecideRequestDto, {
      estado: DecisionEstado.Aprobada,
      comentario: 'Se aprueba, debe regresar el 20/06 en el horario de 8:00 a 6:00.',
    });
    expect(await validate(dto)).toHaveLength(0);
  });

  it('acepta comentario con coma y punto', async () => {
    const dto = plainToInstance(DecideRequestDto, {
      estado: DecisionEstado.Aprobada,
      comentario: 'Solicitud aprobada, revisar con el equipo.',
    });
    expect(await validate(dto)).toHaveLength(0);
  });

  it('acepta comentario con tildes y ñ', async () => {
    const dto = plainToInstance(DecideRequestDto, {
      estado: DecisionEstado.Rechazada,
      comentario: 'Se rechaza según política de la empresa.',
    });
    expect(await validate(dto)).toHaveLength(0);
  });

  // ─── CASOS INVÁLIDOS ──────────────────────────────────────

  it('rechaza un solo punto', async () => {
    const dto = plainToInstance(DecideRequestDto, {
      estado: DecisionEstado.Aprobada,
      comentario: '.',
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('rechaza solo números', async () => {
    const dto = plainToInstance(DecideRequestDto, {
      estado: DecisionEstado.Aprobada,
      comentario: '23',
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('rechaza comentario que empieza con número', async () => {
    const dto = plainToInstance(DecideRequestDto, {
      estado: DecisionEstado.Aprobada,
      comentario: '20/06 aprobado el turno.',
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('rechaza comentario vacío', async () => {
    const dto = plainToInstance(DecideRequestDto, {
      estado: DecisionEstado.Aprobada,
      comentario: '',
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('rechaza cuando falta el comentario', async () => {
    const dto = plainToInstance(DecideRequestDto, {
      estado: DecisionEstado.Aprobada,
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('rechaza comentario menor a 10 caracteres', async () => {
    const dto = plainToInstance(DecideRequestDto, {
      estado: DecisionEstado.Aprobada,
      comentario: 'Corto',
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('rechaza comentario con caracteres especiales como @, #, $', async () => {
    const dto = plainToInstance(DecideRequestDto, {
      estado: DecisionEstado.Rechazada,
      comentario: 'Se rechaza por #falta de personal.',
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
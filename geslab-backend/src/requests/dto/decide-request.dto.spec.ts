import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { DecideRequestDto, DecisionEstado } from './decide-request.dto';

describe('DecideRequestDto', () => {
  it('acepta un motivo compuesto solo por letras', async () => {
    const dto = plainToInstance(DecideRequestDto, {
      estado: DecisionEstado.Rechazada,
      comentario_rechazo: 'MotivoValido',
    });

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it('acepta un comentario libre cuando la decisión es Aprobada', async () => {
    const dto = plainToInstance(DecideRequestDto, {
      estado: DecisionEstado.Aprobada,
      comentario_rechazo: 'Se aprueba solicitud. FLUJO B - ADM1',
    });

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it('rechaza un motivo con espacios', async () => {
    const dto = plainToInstance(DecideRequestDto, {
      estado: DecisionEstado.Rechazada,
      comentario_rechazo: 'Motivo invalido',
    });

    const errors = await validate(dto);

    expect(errors).not.toHaveLength(0);
    expect(errors[0].constraints).toEqual(
      expect.objectContaining({
        matches: expect.any(String),
      }),
    );
  });

  it('rechaza un motivo con caracteres especiales', async () => {
    const dto = plainToInstance(DecideRequestDto, {
      estado: DecisionEstado.Rechazada,
      comentario_rechazo: 'Motivo!',
    });

    const errors = await validate(dto);

    expect(errors).not.toHaveLength(0);
    expect(errors[0].constraints).toEqual(
      expect.objectContaining({
        matches: expect.any(String),
      }),
    );
  });

  it('rechaza un motivo formado solo por espacios', async () => {
    const dto = plainToInstance(DecideRequestDto, {
      estado: DecisionEstado.Rechazada,
      comentario_rechazo: '   ',
    });

    const errors = await validate(dto);

    expect(errors).not.toHaveLength(0);
  });
});

import db from "@/utils/db";

export async function POST(request: Request) {
  const data = await request.json();
  const { fecha, clienteId, membresiaId, descuento } = data;
  try {
    const membresia = await db.membresia.findUnique({
      where: {
        id: membresiaId,
      },
    });
    if (!membresia) {
      return Response.error();
    }

    const cliente = await db.cliente.findUnique({
      where: {
        id: clienteId,
      },
    });
    if (!cliente) {
      return Response.error();
    }
    const montoConDescuento = descuento
      ? membresia.costo - parseFloat(descuento)
      : membresia.costo;
    const nuevoPago = await db.pago.create({
      data: {
        fecha,
        descuento: descuento ? parseFloat(descuento) : 0,
        montoConDescuento: montoConDescuento,
        clienteId,
        membresiaId,
      },
    });

    return Response.json(nuevoPago);
  } catch (error) {
    console.error("Error al crear el pago:", error);
    return Response.error();
  }
}
export async function GET(request: Request) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const id = searchParams.get("id");
  if (id) {
    const pagos = await db.pago.findMany({
      where: {
        clienteId: parseInt(id),
      },
      include: {
        membresia: true,
      },
    });
    return Response.json(pagos);
  }
  const pagos = await db.pago.findMany();
  return Response.json(pagos);
}
export async function PUT(request: Request) {
  const data = await request.json();
  const { id, fecha, clienteId, membresiaId, descuento } = data;
  try {
    const membresia = await db.membresia.findUnique({
      where: {
        id: membresiaId,
      },
    });
    if (!membresia) {
      return Response.error();
    }

    const cliente = await db.cliente.findUnique({
      where: {
        id: clienteId,
      },
    });
    if (!cliente) {
      return Response.error();
    }
    const montoConDescuento = descuento
      ? membresia.costo - parseFloat(descuento)
      : membresia.costo;
    const pagoActualizado = await db.pago.update({
      where: {
        id: id,
      },
      data: {
        fecha,
        descuento: descuento ? parseFloat(descuento) : 0,
        montoConDescuento: montoConDescuento,
        clienteId,
        membresiaId,
      },
    });

    return Response.json(pagoActualizado);
  } catch (error) {
    console.error("Error al actualizar el pago:", error);
    return Response.error();
  }
}

export async function DELETE(request: Request) {
  const data = await request.json();
  const { id } = data;
  console.log(id);
  try {
    await db.pago.delete({
      where: {
        id,
      },
    });

    return Response.json({ id });
  } catch (error) {
    console.error("Error al eliminar el pago:", error);
    return Response.error();
  }
}

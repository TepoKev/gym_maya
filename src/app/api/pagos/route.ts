import db from "@/utils/db";

export async function POST(request: Request) {
  const data = await request.json();
  const { fecha, monto, clienteId, membresiaId } = data;
  try {
    const nuevoPago = await db.pago.create({
      data: {
        fecha,
        monto,
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
    });
    return Response.json(pagos);
  }
  const pagos = await db.pago.findMany();
  return Response.json(pagos);
}

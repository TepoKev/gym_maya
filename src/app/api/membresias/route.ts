import db from "@/utils/db";

export async function POST(request: Request) {
  const data = await request.json();
  const { tipo, costo } = data;
  console.log(tipo, costo)

  try {
    const nuevaMembresia = await db.membresia.create({
      data: {
        tipo,
        costo,
      },
    });

    return Response.json(nuevaMembresia);
  } catch (error) {
    console.error("Error al crear la membresia:", error);
    return Response.error();
  }
}
export async function GET(request: Request) {
    const membresias = await db.membresia.findMany();
    return Response.json(membresias);
}
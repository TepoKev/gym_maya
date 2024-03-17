import db from "@/utils/db";

export async function POST(request: Request) {
  const data = await request.json();
  const { nombre, apellido, email } = data;

  try {
    const nuevoCliente = await db.cliente.create({
      data: {
        nombre,
        apellido,
        email,
      },
    });

    return Response.json(nuevoCliente);
  } catch (error) {
    console.error("Error al crear el cliente:", error);
    return Response.error();
  }
}
export async function GET(request: Request) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const id = searchParams.get("id");
  if (id) {
    const cliente = await db.cliente.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    return Response.json(cliente);
  }
  const clientes = await db.cliente.findMany();
  return Response.json(clientes);
}

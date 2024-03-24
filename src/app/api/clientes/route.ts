import { writeFile } from "fs/promises";
import fs from "fs";
import path from "path";
import db from "@/utils/db";

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    console.log(form);
    const nombre = form.get("nombre");
    const apellido = form.get("apellido");
    const email = form.get("email");
    const telefono = form.get("telefono");
    const imagen: any = form.get("imagen");
    console.log(typeof imagen);
    var imagenPath = "";

    if (imagen !== null && imagen !== undefined && imagen !== "" && imagen !== "undefined") {
      const bytesImg = await imagen.arrayBuffer();
      const bufferImg = Buffer.from(bytesImg);

      imagenPath = path.join(process.cwd(), "public/images_study", imagen.name);

      // Create directory if it does not exist
      const studyImageDir = path.dirname(imagenPath);
      if (!fs.existsSync(studyImageDir)) {
        fs.mkdirSync(studyImageDir, { recursive: true });
      }

      writeFile(imagenPath, bufferImg);
    }

    const nuevoCliente = await db.cliente.create({
      data: {
        nombre: nombre?.toString() as string,
        apellido: apellido?.toString() as string,
        email: email?.toString() as string,
        telefono: telefono?.toString() as string,
        imgPath: imagenPath,
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

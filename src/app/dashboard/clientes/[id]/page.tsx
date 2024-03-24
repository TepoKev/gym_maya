"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Button,
  Modal,
  Autocomplete,
  Avatar,
} from "@mui/material";
import { Trash } from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Cliente {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  imgPath?: string;
}

interface Pago {
  id: string;
  fecha: string;
  montoConDescuento: number;
  descuento: number;
}

interface Membresia {
  id: number;
  tipo: string;
  costo: number;
}

export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  const [cliente, setCliente] = useState<Cliente>({
    id: "",
    nombre: "",
    apellido: "",
    email: "",
  });
  const [monto, setMonto] = useState<string>("");
  const [descuento, setDescuento] = useState<string>("");
  const [fechaPago, setFechaPago] = useState<string | "">("");
  const [membresia, setMembresia] = useState<Membresia | null>(null);
  const [membresias, setMembresias] = useState<Membresia[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function fetchMembresias() {
      const response = await fetch("http://localhost:3000/api/membresias");
      const data = await response.json();
      setMembresias(data);
    }
    fetchMembresias();
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleGuardar = async () => {
    const response = await fetch("http://localhost:3000/api/pagos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        monto: parseFloat(monto),
        fechaPago,
        clienteId: +params.id,
        membresiaId: membresia ? membresia.id : null,
      }),
    });

    if (response.ok) {
      handleClose();
      fetchPagos(id);
    } else {
      console.error("Error al guardar el pago");
    }
  };
  const [pagos, setPagos] = useState<Pago[]>([]);
  useEffect(() => {
    if (id) {
      fetchCliente(id);
      fetchPagos(id);
    }
  }, [id]);

  const fetchCliente = async (id: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/clientes?id=${id}`
      );
      if (response.ok) {
        const data = await response.json();
        setCliente(data);
      } else {
        throw new Error("Error al obtener información del cliente");
      }
    } catch (error) {
      console.error("Error al obtener información del cliente:", error);
    }
  };

  const fetchPagos = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/pagos?id=${id}`);
      if (response.ok) {
        const data = await response.json();
        setPagos(data);
      } else {
        throw new Error("Error al obtener el historial de pagos del cliente");
      }
    } catch (error) {
      console.error(
        "Error al obtener el historial de pagos del cliente:",
        error
      );
    }
  };
  return (
    <div>
      {cliente && (
        <div>
          <h2>Información del Cliente</h2>
          <Avatar
            src={cliente.imgPath}
            alt={cliente.nombre}
            style={{ width: "100px", height: "100px", marginBottom: "16px" }}
          />
          <form>
            <div style={{ marginBottom: "16px" }}>
              <TextField label="Nombre" value={cliente.nombre} fullWidth />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <TextField label="Apellido" value={cliente.apellido} fullWidth />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <TextField label="Teléfono" value={cliente.telefono} fullWidth />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <TextField label="Email" value={cliente.email} fullWidth />
            </div>
          </form>
        </div>
      )}
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Registrar Pago
      </Button>
      <Modal open={open} onClose={handleClose}>
        <div
          style={{
            backgroundColor: "#fff",
            padding: "20px",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <h2>Registrar Pago</h2>
          <form>
            <div style={{ marginBottom: "16px" }}>
              <Autocomplete
                options={membresias}
                getOptionLabel={(option) => option.tipo}
                onChange={(event, newValue) => setMembresia(newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="Membresia" />
                )}
              />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <TextField
                label="Monto"
                value={membresia?.costo || monto}
                onChange={(event) => setMonto(event.target.value)}
                fullWidth
              />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <TextField
                label="Descuento"
                value={descuento}
                onChange={(event) => setDescuento(event.target.value)}
                fullWidth
              />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <TextField
                label="Fecha de Pago"
                type="date"
                value={fechaPago}
                onChange={(event) => setFechaPago(event.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
              />
            </div>
            <div>
              <Button
                variant="contained"
                color="primary"
                onClick={handleGuardar}
              >
                Guardar
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleClose}
                style={{ marginLeft: "10px" }}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      <h2>Historial de Pagos</h2>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Fecha</TableCell>
            <TableCell>Monto</TableCell>
            <TableCell>Eliminar Pago</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pagos.map((pago) => (
            <TableRow key={pago.id}>
              <TableCell>{pago.fecha}</TableCell>
              <TableCell>{pago.montoConDescuento}</TableCell>
              <TableCell>
                <Button
                  onClick={() => {
                    fetch(`http://localhost:3000/api/pagos`, {
                      method: "DELETE",
                      body: JSON.stringify({ id: pago.id }),
                    }).then(() => {
                      console.log("Pago eliminado");
                      fetchPagos(id);
                    });
                  }}
                >
                  <Trash size={32} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

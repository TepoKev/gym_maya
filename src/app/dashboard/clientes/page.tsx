"use client";
import { useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Plus as PlusIcon } from "@phosphor-icons/react/dist/ssr/Plus";
import { Button, Modal, TextField } from "@mui/material";
import { CustomersFilters } from "@/components/dashboard/customer/customers-filters";
import { CustomersTable } from "@/components/dashboard/customer/customers-table";

type Customer = {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
};

export default function Page(): React.JSX.Element {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [open, setOpen] = useState(false);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const page = 0;
  const rowsPerPage = 5;

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/clientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre, apellido, email }),
      });

      if (!response.ok) {
        throw new Error("Error al crear el cliente");
      }
      const fetchCustomers = async () => {
        const response = await fetch("http://localhost:3000/api/clientes");
        const data = await response.json();
        setCustomers(data);
        applyPagination(data, page, rowsPerPage);
      };
      fetchCustomers();
      setLoading(false);
      handleClose();
    } catch (error) {
      console.error("Error al crear el cliente:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    async function fetchCustomers() {
      const response = await fetch("http://localhost:3000/api/clientes");
      const data = await response.json();
      setCustomers(data);
      applyPagination(data, page, rowsPerPage);
    }
    fetchCustomers();
  }, []);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: "1 1 auto" }}>
          <Typography variant="h4">Clientes</Typography>
        </Stack>
        <div>
          <Button
            onClick={handleOpen}
            startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />}
            variant="contained"
          >
            Agregar
          </Button>
          <Modal open={open} onClose={handleClose}>
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "8px",
              }}
            >
              <h2>Nuevo Cliente</h2>
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Nombre"
                  variant="outlined"
                  fullWidth
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  style={{ marginBottom: "20px" }}
                />
                <TextField
                  label="Apellido"
                  variant="outlined"
                  fullWidth
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  style={{ marginBottom: "20px" }}
                />
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ marginBottom: "20px" }}
                />
                <Stack spacing={2} direction="row">
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={!nombre || !apellido || !email || loading}
                  >
                    {loading ? "Creando..." : "Crear Cliente"}
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleClose}
                  >
                    Cancelar
                  </Button>
                </Stack>
              </form>
            </div>
          </Modal>
        </div>
      </Stack>
      <CustomersFilters />
      <CustomersTable
        count={customers.length}
        page={page}
        rows={customers}
        rowsPerPage={rowsPerPage}
      />
    </Stack>
  );
}

function applyPagination(
  rows: Customer[],
  page: number,
  rowsPerPage: number
): Customer[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}

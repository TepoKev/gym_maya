"use client";
import { useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Plus as PlusIcon } from "@phosphor-icons/react/dist/ssr/Plus";
import { Button, Modal, TextField } from "@mui/material";
import { MembresiaFilters } from "@/components/dashboard/membresia/membresia-filters";
import { MembresiaTable } from "@/components/dashboard/membresia/membresia-table";

type Customer = {
  id: number;
  tipo: string;
  costo: number;
};

export default function Page(): React.JSX.Element {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [open, setOpen] = useState(false);
  const [tipo, setTipo] = useState("");
  const [costo, setCosto] = useState<number>(0.0);
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
      const response = await fetch("http://localhost:3000/api/membresias", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tipo, costo }),
      });

      if (!response.ok) {
        throw new Error("Error al crear la membresía");
      }

      setLoading(false);
      handleClose();
    } catch (error) {
      console.error("Error al crear la membresía:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    async function fetchCustomers() {
      const response = await fetch("http://localhost:3000/api/membresias");
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
          <Typography variant="h4">Membresías</Typography>
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
              <h2>Nueva Membresía</h2>
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Tipo"
                  variant="outlined"
                  fullWidth
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  style={{ marginBottom: "20px" }}
                />
                <TextField
                    label="Costo"
                    variant="outlined"
                    fullWidth
                    onChange={(e) => setCosto(parseFloat(e.target.value))}
                    style={{ marginBottom: "20px" }}
                />
                <Stack spacing={2} direction="row">
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={!tipo || !costo || loading}
                  >
                    {loading ? "Creando..." : "Crear Memebresía"}
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
      <MembresiaFilters />
      <MembresiaTable
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

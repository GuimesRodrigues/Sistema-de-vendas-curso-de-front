import { Button, Paper, Typography } from "@mui/material";
import TabelaCliente from "./TabelaCliente";
import api from "../../services/api";
import { useEffect, useState } from "react";
import DialogCliente from "./DialogCliente";
import { cpf } from "cpf-cnpj-validator";
export default function Cliente(props){
    const [paginacao, setPaginacao] = useState({ pagina: 1, totalPagina: 1 });
    const [clientes, setClientes] = useState ([])
    const [clienteEditar, setClienteEditar] = useState(null)
    const [dialogAberto, setDialogCliente] = useState(false)
    const [pesquisa, setPesquisa] = useState("")

    async function busacarCliente() {
    let params = { _page: paginacao.pagina, _per_page: 10 }
    if (pesquisa) {
    if (/^[\d.\-\s]+$/.test(pesquisa)) {
        params["cpf:contains"] = cpf.format(pesquisa);
    } else {
        params["nome:contains"] = pesquisa;
    }
}
    let retorno = await api.get(`/clientes`, { params: params });
    setClientes(retorno.data.data)
    setPaginacao({
            pagina: paginacao.pagina,
            totalPagina: retorno.data.pages
        });
        console.log(pesquisa)
    }
    useEffect(() => { busacarCliente() }, [paginacao.pagina,pesquisa])
    console.log(clientes)

    async function excluirCliente(id) {
        await api.delete(`/clientes/${id}`);
        busacarCliente();
    }

    async function editarCliente(id) {
        const retorno = await api.get(`/clientes/${id}`)
        setClienteEditar(retorno.data)
        setDialogCliente(true)
    }

    async function enviar(cliente) {
        if (clienteEditar) {
            await api.put(`/clientes/${clienteEditar.id}`, cliente);
        } else {
            await api.post("/clientes", cliente);
        }
        busacarCliente()
        setDialogCliente(false)
        setClienteEditar(null)
    }
    return<>
    <Paper>
    <Typography sx={{ p: 1, mt: 1 }} align="center" variant="h4">Gestão de Clientes</Typography>
    <Button
        variant="contained"
        color="primary"
        onClick={() => {
            setClienteEditar(null);
            setDialogCliente(true);
        }}
    >
        Cadastrar Novo Cliente
        
    </Button>
    <br/><br/>
    {dialogAberto && <DialogCliente
                        clienteEditar={clienteEditar}
                        onEnviar={enviar}
                        onClienteEditar={editarCliente}
                        onCancelar={() => {
                            setDialogCliente(false);
                            setClienteEditar(null);
                        }}
                    />}
    <TabelaCliente
    clientes={clientes}
    paginacao={paginacao}
    onPesquisar={texto=>setPesquisa(texto)}
    onExcluir={excluirCliente}
    onClienteEditar={editarCliente}
    onMudarPagina={novaPagina =>
                    setPaginacao({ ...paginacao, pagina: novaPagina })}
    />
    </Paper>
    </>
}
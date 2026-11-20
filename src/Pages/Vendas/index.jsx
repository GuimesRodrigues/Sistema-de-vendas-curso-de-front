import { Button, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../services/api";
import TabelaVendas from "./TabelaVendas";
import DialogDetalheVenda from "./DialogDetalheVenda";
export default function Vendas(){
    const [vendas,setVendas] = useState([])
    const [paginacao, setPaginacao] = useState({pagina:1,totalPagina:1})
    const [dialogPreenchido,setDialogPreenchido] = useState(null)
    const [dialogVenda, setDialogVenda] = useState(false)
    const [clientes, setClientes] = useState([])
    const [produtos, setProdutos] = useState([])

    async function buscarClientes() {
        let params = {_page:paginacao.pagina, _per_page:10}
        let retorno = await api.get("/clientes", { params: params })
        setClientes(retorno.data.data)
        setPaginacao({
            pagina: paginacao.pagina,
            totalPagina: retorno.data.pages
            
        })
    }

    async function buscarProdutos() {
        let params = {_page:paginacao.pagina, _per_page:10}
        let retorno = await api.get("/produtos", { params: params })
        setProdutos(retorno.data.data)
        setPaginacao({
            pagina: paginacao.pagina,
            totalPagina: retorno.data.pages
            
        })
    }

    useEffect(() => {
        buscarClientes()
        buscarProdutos()
    }, [])
    
    async function buscarVendas() {
        let params = {_page:paginacao.pagina, _per_page:10}
        let retorno = await api.get('/vendas',{params:params})
        setVendas(retorno.data.data)
        setPaginacao({
            pagina: paginacao.pagina,
            totalPagina: retorno.data.pages
            
        })
       
    }
    useEffect(()=>{buscarVendas()},[paginacao.pagina])
    
    async function abrirDetalhes(id){
        const retorno= await api.get(`/vendas/${id}`)
        setDialogPreenchido(retorno.data)
        setDialogVenda(true)
    }

    async function enviar(venda) {
        await api.post("/vendas", venda)
        await buscarVendas()
        setDialogVenda(false)
        setDialogPreenchido(null)
    }
    
    return<>
    <Paper sx={{ p: 1, mt: 1}}>
        <Typography sx={{ p: 1, mt: 1 }} align="center" variant="h4">Gestão de Vendas</Typography>
        <br/>
        {dialogVenda &&
                        <DialogDetalheVenda
                            dialogPreenchido={dialogPreenchido}
                            clientes={clientes}
                            produtos={produtos}
                            onEnviar={enviar}
                            onFechar={() => {
                                setDialogVenda(false)
                                setDialogPreenchido(null)
                            }}
                        />
                    }
        <Button 
        variant="contained"
        color="primary"
        onClick={() => {
            setDialogPreenchido(null)
            setDialogVenda(true)
        }}>

            Registrar nova venda

        </Button>
        <TabelaVendas
            vendas={vendas}
            clientes={clientes}
            produtos={produtos}
            paginacao={paginacao}
            onAbrirDetalhes={abrirDetalhes}
            onMudarPagina={novaPagina =>
                setPaginacao({ ...paginacao, pagina: novaPagina })}
        />
    </Paper>
    </>
}
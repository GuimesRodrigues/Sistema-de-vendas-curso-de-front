import { Paper } from "@mui/material";
import { useState } from "react";
import api from "../../services/api";
export default function Vendas(){
    const {vendas,setVendas} = useState([])
    const {paginacao, setPaginacao} = useState({pagina:1,totalPagina:1})
    
    async function buscarVendas() {
        let params = {_page:paginacao.pagina, _per_page:10}
        let retorno = await api.get('/vendas')
    }
    return<>
    <Paper>Esta e a pagina de Venda</Paper>
    </>
}
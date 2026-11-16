import { Paper } from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../services/api";
import TabelaVendas from "./TabelaVendas";
export default function Vendas(){
    const [vendas,setVendas] = useState([])
    const [paginacao, setPaginacao] = useState({pagina:1,totalPagina:1})
    
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
    
    return<>
    <Paper>
        <TabelaVendas
            vendas={vendas}
            paginacao={paginacao}
            onMudarPagina={novaPagina =>
                setPaginacao({ ...paginacao, pagina: novaPagina })}
        />
    </Paper>
    </>
}
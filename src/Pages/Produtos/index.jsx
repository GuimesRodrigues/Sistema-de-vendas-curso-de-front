import { Button, Paper, Typography } from "@mui/material";
import TabelaProdutos from "./Tabela";
import api from '../../services/api';
import { useEffect, useState } from "react";
export default function Produtos(){
    const [DialogProduto, setDialogProduto] = useState(false)
    const [paginacao, setPaginacao] = useState({pagina:1,totalPagina:1});
    const [produtos, setProdutos] = useState ([]);
    const [produtoParaEditar, setProdutoParaEditar] = useState(null)

    async function buscarProduto (){
        let params={_page:paginacao.pagina,_per_page:10}
        let retorno = await api.get(`/produtos`,{params:params});
        setProdutos(retorno.data.data)
        setPaginacao( {
            pagina:paginacao.pagina,
            totalPagina: retorno.data.pages
        });
       console.log(retorno)
    }   
    useEffect(()=>{buscarProduto()},[paginacao.pagina])
    
    async function editarProduto(id) {
        let retorno = await api.get(`/produtos/${id}`);
        setProdutoParaEditar(id)
        
    }

    async function excluirProduto(id) {
        await api.delete(`/produtos/${id}`);
        await buscarProduto();
    }

    async function editarProduto(id){
        
    }

    return<>
    <Paper sx={{p:1,mt:1}}>
        <Typography sx={{p:1,mt:1 }} align="center" variant="h4">Gestão de Produtos</Typography>
        <Button>Cadastrar Novo Produto</Button>
        <TabelaProdutos
            produtos={produtos}
            paginacao={paginacao}
            onEditar={editarProduto}
            onExcluir={excluirProduto}
            onMudarPagina={novaPagina=>
                    setPaginacao({...paginacao, pagina:novaPagina}) }
        />
    </Paper>
    </>
}
import { Button, Paper, Typography } from "@mui/material";
import TabelaProdutos from "./Tabela";
import DialogProduto from "./DialogProduto";
import api from '../../services/api';
import { useEffect, useState } from "react";
export default function Produtos(){
    const [dialogProdutoAberto, setDialogProdutoAberto] = useState(false)
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

    async function excluirProduto(id) {
        await api.delete(`/produtos/${id}`);
        buscarProduto();
    }

    async function editarProduto(id){
        const retorno = await api.get(`/produtos/${id}`);
        setProdutoParaEditar(retorno.data);
        setDialogProdutoAberto(true);
    }

    async function enviar(produto){
        if (produtoParaEditar) {
            await api.put(`/produtos/${produtoParaEditar.id}`, produto);
        } else {
            await api.post("/produtos", produto);
        }

        await buscarProduto();
        setDialogProdutoAberto(false);
        setProdutoParaEditar(null);
    }

    return<>
    <Paper sx={{p:1,mt:1}}>
        <Typography sx={{p:1,mt:1 }} align="center" variant="h4">Gestão de Produtos</Typography>
        {dialogProdutoAberto &&
         <DialogProduto
                onEnviar={enviar}
                produtoParaEditar = {produtoParaEditar}
                onCancelar={()=>{
                    setDialogProdutoAberto(false);
                    setProdutoParaEditar(null);
                }}
            />
        }
        <Button color="primary" onClick={()=>{
            setProdutoParaEditar(null);
            setDialogProdutoAberto(true);
        }}>Cadastrar Novo Produto</Button>
        <TabelaProdutos
            produtos={produtos}
            paginacao={paginacao}
            onEditarProduto={editarProduto}
            onExcluir={excluirProduto}
            onMudarPagina={novaPagina=>
                    setPaginacao({...paginacao, pagina:novaPagina}) }
        />
    </Paper>
    </>
}
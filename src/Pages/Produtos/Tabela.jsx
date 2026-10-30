import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Pagination, Table, TableBody, TableCell, TableFooter, TableHead, TableRow } from "@mui/material";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useState } from 'react';
export default function TabelaProdutos (props) {
    const [produtoParaExcluir, setProdutoParaExcluir] = useState (null)

    async function confirmarExclusao() {
        await props.onExcluir(produtoParaExcluir.id)
        setProdutoParaExcluir(null)
    }

    return <>
       {produtoParaExcluir && <Dialog open onClose={() => setProdutoParaExcluir(null)}>
            <DialogTitle>Deseja excluir este Produto?</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Deseja realmente excluir este produto: {produtoParaExcluir.id} - {produtoParaExcluir.nome}?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setProdutoParaExcluir(null)} color="warning">Cancelar</Button>
                <Button onClick={confirmarExclusao} color="primary">Confirmar</Button>
            </DialogActions>
        </Dialog>}


        <Table>
        <TableHead>
            <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nome</TableCell>
                <TableCell>Valor</TableCell>
                <TableCell>Estoque</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {props.produtos.map(produto=>
                <TableRow key={produto.id}>
                    <TableCell>{produto.id}</TableCell>
                    <TableCell>{produto.nome}</TableCell>
                    <TableCell>{produto.valor}</TableCell>
                    <TableCell>{produto.estoque}</TableCell>
                    <TableCell>
                        <IconButton onClick={()=>setProdutoParaExcluir(produto)}>
                        <DeleteOutlineOutlinedIcon color="warning" />
                    </IconButton>
                    <IconButton onClick={
                            ()=>props.onEditarProduto(produto.id) }>
                        <EditOutlinedIcon color="primary" />
                    </IconButton>
                    </TableCell>
                </TableRow>
            )}
        </TableBody>
        <TableFooter>
            <TableRow>
                <TableCell colSpan={5}>
                    <Pagination  
                        page={props.paginacao.pagina} 
                        count={props.paginacao.totalPagina}
                        onChange={
                            (evento, novaPagina)=>props.onMudarPagina(novaPagina)
                            }
                        />
                </TableCell>
            </TableRow>
        </TableFooter>
    </Table>
    </>
}
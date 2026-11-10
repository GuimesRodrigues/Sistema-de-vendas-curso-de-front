import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, InputAdornment, Pagination, Table, TableBody, TableCell, TableFooter, TableHead, TableRow, TextField } from "@mui/material";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
export default function TabelaCliente(props) {
    const [clienteParaExcluir, setClienteParaExcluir] = useState(null)

    async function confirmarExclusao() {
        await props.onExcluir(clienteParaExcluir.id)
        setClienteParaExcluir(null)
    }

    return <>
        {clienteParaExcluir && <Dialog open onClose={() => setClienteParaExcluir(null)}>
            <DialogTitle>Deseja excluir este cliente?</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Deseja realmente excluir este Cliente: {clienteParaExcluir.nome} ID:{clienteParaExcluir.id}?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setClienteParaExcluir(null)} color="warning">Cancelar</Button>
                <Button onClick={confirmarExclusao} color="primary">Confirmar</Button>
            </DialogActions>
        </Dialog>}
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Nome</TableCell>
                    <TableCell>CPF/CNPJ</TableCell>
                    <TableCell>Ações</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {props.clientes.map(cliente =>
                    <TableRow key={cliente.id}>
                        <TableCell>{cliente.id}</TableCell>
                        <TableCell>{cliente.nome}</TableCell>
                        <TableCell>{cliente.cpf}</TableCell>
                        <TableCell><IconButton onClick={() => setClienteParaExcluir(cliente)}>
                            <DeleteOutlineOutlinedIcon color="warning" />
                        </IconButton>
                            <IconButton onClick={
                                () => props.onClienteEditar(cliente.id)}>
                                <EditOutlinedIcon color="primary" />
                            </IconButton></TableCell>
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
                                (evento, novaPagina) => props.onMudarPagina(novaPagina)
                            }
                        />
                    </TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    </>
}
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    InputAdornment,
    Pagination,
    Radio,
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableRow,
    TextField
} from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import { useEffect, useState } from "react"
import { cpf } from "cpf-cnpj-validator"
import api from "../../services/api"

export default function DialogCliente(props) {
    const [clientes, setClientes] = useState([])
    const [clienteSelecionado, setClienteSelecionado] = useState(null)
    const [pesquisa, setPesquisa] = useState("")
    const [erro, setErro] = useState(null)
    const [paginacao, setPaginacao] = useState({
        pagina: 1,
        totalPagina: 1
    })

    async function buscarClientes() {
        const params = {
            _page: paginacao.pagina,
            _per_page: 10
        }

        if (pesquisa) {
            if (/^[\d.\-\s]+$/.test(pesquisa)) {
                params["cpf:contains"] = cpf.format(pesquisa)
            } else {
                params["nome:contains"] = pesquisa
            }
        }

        try {
            const retorno = await api.get("/clientes", { params })
            setClientes(retorno.data.data)
            setPaginacao({
                pagina: paginacao.pagina,
                totalPagina: retorno.data.pages
            })
            setErro(null)
        } catch {
            setErro("Não foi possível carregar a lista de clientes.")
        }
    }

    useEffect(() => {
        if (props.open) {
            buscarClientes()
        }
    }, [props.open, paginacao.pagina, pesquisa])

    function pesquisarClientes(formdata) {
        setPaginacao({ ...paginacao, pagina: 1 })
        setPesquisa(formdata.get("pesquisa"))
        setClienteSelecionado(null)
    }

    function fechar() {
        setClienteSelecionado(null)
        props.onFechar()
    }

    function confirmar() {
        props.onSelecionar(clienteSelecionado)
        setClienteSelecionado(null)
        props.onFechar()
    }

    return (
        <Dialog open={props.open} onClose={fechar} fullWidth maxWidth="md">
            <DialogTitle align="center">Selecione um cliente</DialogTitle>
            <DialogContent>
                {erro && <Alert severity="error">{erro}</Alert>}
                <Box sx={{ mb: 2, mt: 1 }}>
                    <form action={pesquisarClientes}>
                        <TextField
                            label="Pesquisar por nome ou CPF"
                            name="pesquisa"
                            fullWidth
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton type="submit">
                                                <SearchIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }
                            }}
                        />
                    </form>
                </Box>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Selecionar</TableCell>
                            <TableCell>ID</TableCell>
                            <TableCell>Nome</TableCell>
                            <TableCell>CPF/CNPJ</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {clientes.map(cliente => (
                            <TableRow
                                key={cliente.id}
                                selected={String(clienteSelecionado?.id) === String(cliente.id)}
                                onClick={() => setClienteSelecionado(cliente)}
                                sx={{ cursor: "pointer" }}
                            >
                                <TableCell>
                                    <Radio
                                        checked={String(clienteSelecionado?.id) === String(cliente.id)}
                                    />
                                </TableCell>
                                <TableCell>{cliente.id}</TableCell>
                                <TableCell>{cliente.nome}</TableCell>
                                <TableCell>{cliente.cpf}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={4}>
                                <Pagination
                                    page={paginacao.pagina}
                                    count={paginacao.totalPagina}
                                    onChange={(evento, novaPagina) => {
                                        setClienteSelecionado(null)
                                        setPaginacao({
                                            ...paginacao,
                                            pagina: novaPagina
                                        })
                                    }}
                                />
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="warning" onClick={fechar}>
                    Cancelar
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={confirmar}
                    disabled={!clienteSelecionado}
                >
                    Selecionar
                </Button>
            </DialogActions>
        </Dialog>
    )
}
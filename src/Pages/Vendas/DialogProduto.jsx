import {
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
import api from "../../services/api"

export default function DialogProduto(props) {
    const [produtos, setProdutos] = useState([])
    const [produtoSelecionado, setProdutoSelecionado] = useState(null)
    const [pesquisa, setPesquisa] = useState("")
    const [paginacao, setPaginacao] = useState({
        pagina: 1,
        totalPagina: 1
    })

    async function buscarProdutos() {
        const params = {
            _page: paginacao.pagina,
            _per_page: 10
        }

        if (pesquisa) {
            params["nome:contains"] = pesquisa
        }

        const retorno = await api.get("/produtos", { params })
        setProdutos(retorno.data.data)
        setPaginacao({
            pagina: paginacao.pagina,
            totalPagina: retorno.data.pages
        })
    }

    useEffect(() => {
        if (props.open) {
            buscarProdutos()
        }
    }, [props.open, paginacao.pagina, pesquisa])

    function pesquisarProdutos(formdata) {
        setPaginacao({ ...paginacao, pagina: 1 })
        setPesquisa(formdata.get("pesquisa"))
        setProdutoSelecionado(null)
    }

    function fechar() {
        setProdutoSelecionado(null)
        props.onFechar()
    }

    function confirmar() {
        props.onSelecionar(produtoSelecionado)
        setProdutoSelecionado(null)
        props.onFechar()
    }

    return (
        <Dialog open={props.open} onClose={fechar} fullWidth maxWidth="md">
            <DialogTitle align="center">Selecione um produto</DialogTitle>
            <DialogContent>
                <Box sx={{ mb: 2 }}>
                    <form action={pesquisarProdutos}>
                        <TextField
                            label="Pesquisar produto"
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
                            <TableCell>Valor</TableCell>
                            <TableCell>Estoque</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {produtos.map(produto => (
                            <TableRow
                                key={produto.id}
                                selected={produtoSelecionado?.id === produto.id}
                                onClick={() => setProdutoSelecionado(produto)}
                                sx={{ cursor: "pointer" }}
                            >
                                <TableCell>
                                    <Radio
                                        checked={produtoSelecionado?.id === produto.id}
                                    />
                                </TableCell>
                                <TableCell>{produto.id}</TableCell>
                                <TableCell>{produto.nome}</TableCell>
                                <TableCell>{produto.valor}</TableCell>
                                <TableCell>{produto.estoque}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={5}>
                                <Pagination
                                    page={paginacao.pagina}
                                    count={paginacao.totalPagina}
                                    onChange={(evento, novaPagina) => {
                                        setProdutoSelecionado(null)
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
                    disabled={!produtoSelecionado}
                >
                    Selecionar
                </Button>
            </DialogActions>
        </Dialog>
    )
}
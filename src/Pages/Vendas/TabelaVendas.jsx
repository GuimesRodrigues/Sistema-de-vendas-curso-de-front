import { Alert, IconButton, Pagination, Table, TableBody, TableCell, TableFooter, TableHead, TableRow, Tooltip } from "@mui/material";
import Detalhes from '@mui/icons-material/LoupeOutlined';
import { useEffect, useState } from "react";
import api from "../../services/api";

export default function TabelaVendas(props) {
    const clientes = props.clientes || []
    const produtos = props.produtos || []
    const vendas = props.vendas || []
    const [produtosAdicionais, setProdutosAdicionais] = useState([])
    const [erroPrecos, setErroPrecos] = useState(false)

    useEffect(() => {
        const idsProdutos = [...new Set(
            vendas.flatMap(venda =>
                venda.produtos.map(produto => String(produto.idProduto))
            )
        )]
        const produtosCarregados = [...produtos, ...produtosAdicionais]
        const idsNaoCarregados = idsProdutos.filter(id =>
            !produtosCarregados.some(produto => String(produto.id) === id)
        )

        if (!idsNaoCarregados.length) {
            setErroPrecos(false)
            return
        }

        let ativo = true
        Promise.all(idsNaoCarregados.map(async id => {
            const retorno = await api.get(`/produtos/${id}`)
            return retorno.data
        }))
            .then(produtosEncontrados => {
                if (ativo) {
                    setProdutosAdicionais(atuais => [
                        ...atuais,
                        ...produtosEncontrados
                    ])
                    setErroPrecos(false)
                }
            })
            .catch(() => {
                if (ativo) {
                    setErroPrecos(true)
                }
            })

        return () => {
            ativo = false
        }
    }, [vendas, produtos, produtosAdicionais])

    function buscarCliente(venda) {
        return clientes.find(cliente =>
            String(cliente.id) === String(venda.idCliente)
        )
    }

    function buscarProduto(produto) {
        return [...produtos, ...produtosAdicionais].find(item =>
            String(item.id) === String(produto.idProduto)
        )
    }

    function calcularTotal(venda) {
        let total = 0

        for (const item of venda.produtos) {
            const produto = buscarProduto(item)
            if (!produto || !Number.isFinite(Number(produto.valor))) {
                return null
            }

            total += Number(produto.valor) * Number(item.quantidade)
        }

        return total
    }

    function mostrarTotal(venda) {
        const total = calcularTotal(venda)
        return total === null
            ? "Preço indisponível"
            : total.toLocaleString("pt-BR", { maximumFractionDigits: 2 })
    }

    return <>
    {erroPrecos &&
        <Alert severity="error">
            Não foi possível carregar o preço de alguns produtos.
        </Alert>}
    <Table>
        <TableHead>
            <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Data</TableCell>
                <TableCell>Produtos</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Ações</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {vendas.map(venda =>
                <TableRow key={venda.id}>
                    <TableCell>{venda.id}</TableCell>
                    <TableCell>
                    {buscarCliente(venda)
                        ? `${buscarCliente(venda).nome} (${buscarCliente(venda).id})`
                        : venda.idCliente}
                    </TableCell>
                    <TableCell>{new Date(venda.data).toLocaleString("pt-BR")}</TableCell>
                    <TableCell>
                        {venda.produtos.map(produto =>
                            <div key={produto.idProduto}>
                                {buscarProduto(produto)
                                    ? `${buscarProduto(produto).nome} (${buscarProduto(produto).id})`
                                    : produto.idProduto}
                                {" "}(quantidade: {produto.quantidade})
                            </div>
                        )}
                    </TableCell>
                    <TableCell>
                        {mostrarTotal(venda)}
                    </TableCell>
                    <TableCell>
                        <Tooltip title="Detalhes da venda">
                            <IconButton onClick={()=>props.onAbrirDetalhes(venda.id)}>
                                <Detalhes color="success"/>
                            </IconButton>
                        </Tooltip>    
                    </TableCell>
                </TableRow>
            )}
        </TableBody>
        <TableFooter>
            <TableRow>
                <TableCell colSpan={6}>
                    <Pagination
                        page={props.paginacao.pagina}
                        count={props.paginacao.totalPagina}
                        onChange={(evento, novaPagina) => props.onMudarPagina(novaPagina)}
                    />
                </TableCell>
            </TableRow>
        </TableFooter>
    </Table>
    </>
}
import { IconButton, Pagination, Table, TableBody, TableCell, TableFooter, TableHead, TableRow, Tooltip } from "@mui/material";
import Detalhes from '@mui/icons-material/LoupeOutlined';
export default function TabelaVendas(props) {
    const clientes = props.clientes || []
    const produtos = props.produtos || []
    const vendas = props.vendas || []

    function buscarCliente(venda) {
        return clientes.find(cliente =>
            String(cliente.id) === String(venda.idCliente)
        )
    }

    function buscarProduto(produto) {
        return produtos.find(item =>
            String(item.id) === String(produto.idProduto)
        )
    }

    return <Table>
        <TableHead>
            <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Data</TableCell>
                <TableCell>Produtos</TableCell>
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
                <TableCell colSpan={4}>
                    <Pagination
                        page={props.paginacao.pagina}
                        count={props.paginacao.totalPagina}
                        onChange={(evento, novaPagina) => props.onMudarPagina(novaPagina)}
                    />
                </TableCell>
            </TableRow>
        </TableFooter>
    </Table>
}
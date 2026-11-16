import { Pagination, Table, TableBody, TableCell, TableFooter, TableHead, TableRow } from "@mui/material";

export default function TabelaVendas(props) {
    return <Table>
        <TableHead>
            <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Data</TableCell>
                <TableCell>Produtos</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {props.vendas.map(venda =>
                <TableRow key={venda.id}>
                    <TableCell>{venda.id}</TableCell>
                    <TableCell>{venda.idCliente}</TableCell>
                    <TableCell>{new Date(venda.data).toLocaleString("pt-BR")}</TableCell>
                    <TableCell>
                        {venda.produtos.map(produto =>
                            <div key={produto.idProduto}>
                                {produto.idProduto} (quantidade: {produto.quantidade})
                            </div>
                        )}
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
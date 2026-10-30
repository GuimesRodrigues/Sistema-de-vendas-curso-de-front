import { Routes, Route, Outlet, Navigate } from "react-router"
import Menu from "../Menu";
import Home from "../../Pages/Home";
import Produtos from "../../Pages/Produtos";
import Vendas from "../../Pages/Vendas";
import Cliente from "../../Pages/Cliente";

export default function Principal(){
    return <>
        <Menu/>
        <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/produtos" element={<Produtos />} />
            <Route path="/cliente" element={<Cliente/>} />
            <Route path="/vendas" element={<Vendas />} />
        </Routes>
    </>
}
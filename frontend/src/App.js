import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";

import Navbar from "./components/navbar/navbar";
import Footer from "./components/footer/footer";
import Home from "./components/homepage/home";
import GenderLandingPage from "./components/gender-landingpage/gender";
import ProductGallery from "./components/product-gallery/productGallery";
import ProductPage from "./components/product/productPage";
import Login from "./components/login/login";
import Register from "./components/register/register";
import MyAccount from "./components/account/myAccount";
import ShoppingCart from "./components/order/shoppingCart";
import Checkout from "./components/order/checkout";
import TOS from "./components/TOS/tos";
import NotFound from './components/404/notFound';

import AdminHome from "./components/CMS/AdminHome";
import AdminProducts from "./components/CMS/AdminProducts";

import NavContextProvider from "./contexts/NavContext";
import ProductSizesContextProvider from "./contexts/ProductSizesContext";
import ProductCategoryContextProvider from "./contexts/ProductCategoryContext";
import AuthContextProvider from "./contexts/AuthContext";
import ShoppingCartProvider from './contexts/ShoppingCartContext';

import "./css/App.css";


class App extends Component {
	
	render() {

		return (
			<div className="app">
			<BrowserRouter basename="/">
			<AuthContextProvider>
			<ShoppingCartProvider>
			<NavContextProvider>

			<Switch>
	
				<Route exact path="/">
					<Navbar />
					<Home />
					<Footer />	
				</Route>
				
				<Route exact path="/fashion/:gender" component={GenderLandingPage} />

				<Route exact path="/fashion/:gender/:category" component={ProductGallery} />
				<Route exact path="/fashion/:gender/:category/:subcategory" component={ProductGallery} />

				<Route exact path="/products/:gender/:category/:subcategory/:title" component={ProductPage} />

				<Route exact path="/tos">
					<Navbar />
					<TOS />
					<Footer />
				</Route>
				
				<Route exact path="/404">
					<Navbar />
					<NotFound />
					<Footer />
				</Route>
				
				
				<Route exact path="/account/login">
					<Login />
				</Route>
				<Route exact path="/account/register">
					<Register />
				</Route>
				<Route exact path="/account/my-account">
					<MyAccount />
				</Route>

				<Route exact path="/shopping-bag">
					<ShoppingCart />
				</Route>

				<Route exact path="/checkout">
					<Checkout />
				</Route>
			
				
				<Route exact path="/cms">
					<AdminHome />
				</Route>
				
				<Route exact path="/cms/products">
					<ProductSizesContextProvider>
					<ProductCategoryContextProvider>
					<AdminProducts />
					</ProductCategoryContextProvider>
					</ProductSizesContextProvider>
				</Route>


				<Route path="*">
					<Redirect to="/404" />	
				</Route>
			
			</Switch>

			</NavContextProvider>
			</ShoppingCartProvider>
			</AuthContextProvider>
			</BrowserRouter>
			</div>
		);

	}
  
}

export default App;
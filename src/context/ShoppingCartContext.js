import { createContext, useState, useContext } from "react";
import { AuthContext } from "./AuthContext";

export const ShoppingCartContext = createContext();

export const ShoppingCartProvider = ({ children }) => {
	const { user } = useContext(AuthContext);
	const [items, setItems] = useState(
		JSON.parse(localStorage.getItem("movieapp.shoppingcart")) ?? []
	);

	function saveInCart(movie) {
		const object = {
			movie,
			user_id: user.id,
			quantity: 1,
		};

		items[items.length] = object;
		setItems([...items]);
		saveInLocalStorage(items);
	}

	function movieIsInCart(id) {
		const movie = items.find(
			(item) => item.movie.imdbID === id && item.user_id === user.id
		);
		return movie;
	}

	function upOne(id) {
		const movie = movieIsInCart(id);
		if (movie === undefined) return;
		if (movie.quantity >= 10) return;
		const index = items.findIndex(
			(item) => item.movie.imdbID === id && item.user_id === user.id
		);
		movie.quantity++;
		items[index] = movie;
		setItems([...items]);
		saveInLocalStorage(items);
	}

	function downOne(id) {
		const movie = movieIsInCart(id);
		if (movie === undefined) return;
		const index = items.findIndex(
			(item) => item.movie.imdbID === id && item.user_id === user.id
		);
		if (movie.quantity < 2) {
			items.splice(index, 1);
		} else {
			movie.quantity--;
			items[index] = movie;
		}
		setItems([...items]);
		saveInLocalStorage(items);
	}

	function cleanCart() {
		setItems([]);
		saveInLocalStorage([]);
	}

	function saveInLocalStorage(items) {
		localStorage.setItem("movieapp.shoppingcart", JSON.stringify(items));
	}

	return (
		<ShoppingCartContext.Provider
			value={{
				items,
				saveInCart,
				movieIsInCart,
				upOne,
				downOne,
				cleanCart,
			}}
		>
			{children}
		</ShoppingCartContext.Provider>
	);
};

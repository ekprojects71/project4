import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

//this component is a list item of the orders list in my account
//It takes 1 prop: order - which contains the data for 1 individual order

const OrderItem = (props) => {

    const [ toggled, setToggled ] = useState(false);

    const toggleOrder = (e) => {
       setToggled(!toggled);
    }

    const computeTotal = () => {
        let total = 0;
        props.order.contents.forEach(product => {
            total += product.price * product.quantity;
        })

        return total.toFixed(2);
    }


    return (
        <div className="order-item">
        <button className={`order-toggle ${toggled ? ("expanded"):("collapsed")}`}
            onClick={toggleOrder}>

            <div className="details">
                <h2>Order Number: {props.order.orderNumber}</h2>
                <p>{new Date(props.order.date).toDateString()}</p>
            </div>
            <img src="/assets/icons/chevron.svg" alt="collapse-expand" className='expand-icon'></img>
        </button>

        <div className={`shipping-info ${toggled ? (""):("hidden")}`}>
            <h2>Shipped to:</h2>
            <p>{props.order.streetAddress}</p>
            <p>{`${props.order.city}, ${props.order.state} ${props.order.zipcode}`}</p>
        </div>

        <div className={`order-total ${toggled ? (""):("hidden")}`}>
            <span>Order Total: ${computeTotal()}</span>
        </div>

        <ul className={`order-list ${toggled ? (""):("hidden")}`}>
            {props.order.contents.map(product => {

                return (
                    <li className="product" key={uuidv4()}>
                        <div className="product-content">

                            <div className="sm-screen-left">
                                <div className="img">
                                    <img src={product.image} alt="thumbnail" />
                                </div> 
                            </div>

                            <div className="sm-screen-right">
                                <div className="name">
                                    <span>{product.name}</span>
                                </div>
                                <div className="size">
                                    {product.sizeName ? (
                                        <span>Size: {product.sizeName}</span>    
                                    ) : (<span></span>)}
                                </div>
                                <div className="quantity">
                                    <span>Qty: {product.quantity}</span>
                                </div>
                                <div className="price">
                                    <span>{`$${(Math.round(product.price * product.quantity * 100) / 100).toFixed(2)}`}</span>
                                </div>   
                            </div>

                        </div>
                    </li>
                )

            })}
        </ul>
        </div>
    )

};

export default OrderItem;
import { useState } from 'react';
import { useParams, useLoaderData } from 'react-router-dom';
import classes from './ViewTask.module.css';
import Modal from './Modal';
const ViewTask = ({}) => {
    const product = useLoaderData();
    console.log(product);
    return (
        <Modal /*onClose={onClose}*/>
            <h2>Product Details</h2>
            <div className={classes.body}>
                {
                    product &&
                    <>
                        <div className={classes.form}>
                            {product.images.map(image => <img key={image.URL} src={'/src/assets/' + image.URL} alt="logo" className={classes.image} />)}
                        </div>
                        <div className={classes.form}>
                            {
                                Object.entries(product.product[0]).map(([key, value]) => (
                                    !((key === 'SuppID' && value==0) || (key === 'qty' && value==0)||(key == 'StoreID' || key=='IsSold'|| key=='Capital' || key=='ID')  )&&(
                                        <div key={key}>
                                            <label htmlFor={key}>{key}:</label>
                                            <input type="text" id={key} value={value} readOnly />
                                        </div>
                                    )
                                ))
                            }


                        </div>
                    </>
                }

            </div>
        </Modal>
    );
};

export default ViewTask;


export async function loader({ params }) {
    let resData = {};
    try {
        console.log(params.productID.split('=')[1]);
        const data = {
            id: params.productID.split('=')[1],
        };
        const paramString = JSON.stringify(data);
        const response = await fetch('http://localhost/MyInv/actions/productDetails.php', {
            method: 'POST',
            body: paramString,
            headers: {
                'Content-Type': 'application/json'
            }
        }
        );
        const responseJson = await response.json();

        const data2 = {
            id: params.productID.split('=')[1],
        };
        const paramString2 = JSON.stringify(data2);
        const response2 = await fetch('http://localhost/MyInv/actions/fetchImages.php', {
            method: 'POST',
            body: paramString2,
            headers: {
                'Content-Type': 'application/json'
            }
        }
        );
        const productImages = await response2.json();
        resData = { product: responseJson, images: productImages }
    } catch (error) {
        console.error('Error fetching product Images:', error);
    }
    return resData;
}
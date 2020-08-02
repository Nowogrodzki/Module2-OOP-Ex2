import { v4 as uuidv4 } from 'uuid';

class Validator {
    static isString(value){ 
        return typeof value === 'string' || value instanceof String;
    }
    static isProduct(value){ 
        return value instanceof SingleProduct
    }
    static isPrice(value){ 
        return value <= 0
    }
    static isNumber(value){ 
        return typeof value === 'number' && isFinite(value)
    }
    static isType(value, constructor){ 
        return value instanceof constructor
    }
    static hasProperty(object, name){ 
        return object.hasOwnProperty(name)
    }
}

class ShoppingCart {
    constructor(shoppingCartData) {
        this.validateIntroducedData(shoppingCartData)

        this.discount = shoppingCartData.discount ? shoppingCartData.discount : 0; 
        this.discountCode = shoppingCartData.discountCode;
        this.products = [];
    }

    validateIntroducedData(shoppingCartData) {
        if(!Validator.hasProperty(shoppingCartData, 'discountCode')) throw new Error('Data is missing one of the properties: discountCode')
            
        if(!Validator.isString(shoppingCartData.discountCode)) throw new Error('Product name must be a string')

        if(shoppingCartData.discountCode.length < 3) throw new Error('Product name must be greater then 3');
    }

    add(product) {
        if(!(Validator.isProduct(product))) throw new Error('Method only argument is instace of SingleProduct');

        this.products.push(product);
    }

    removeById(id) {
        const index = this.products.findIndex(item => item.id === id);

        this.products.splice(index, 1);
    }

    count() {
        if(!this.products.length) {
            throw new Error('No prodcuts in shopping cart')
        } else {
            const init = {
                price:0,
                discount:0,
            }
            const allSums = this.products.reduce((acc, value) => {
                acc.price += value.price
                acc.discount += (value.price * (value.discount/100))
                return acc
             }, init)
    
             const itemsIn = this.products.length;

             const PriceAfterDiscout = init.price - init.discount;
    
             const finalPrice = PriceAfterDiscout - (PriceAfterDiscout * (this.discount / 100))
    
             return {
                itemsIn,
                sumPrices : init.price,
                sumDiscounts : init.discount,
                PriceAfterDiscout,
                finalPrice
             }    
        }
    }
}
class SingleProduct {
    constructor(productData) {
        this.validateInput(productData)

        this.name = productData.name
        this.price = productData.price
        this.category = productData.category
        this.discount = productData.discount ? productData.discount : 0
        this.id = uuidv4()
    }

    validateInput(productData) {
        if(!Validator.hasProperty(productData, 'name') || !Validator.hasProperty(productData, 'category') || !Validator.hasProperty(productData, 'price')) 
        throw new Error('Data is missing one of the properties: name, price, category');

        if(!Validator.isString(productData.name)) throw new Error('Product name must be a string');
        if(productData.name.length < 3) throw new Error('Product name must be greater then 3');
        
        if(!Validator.isString(productData.category)) throw new Error('Product category must be a string');
        if(productData.category.length < 3) throw new Error('Product category length must be greater then 3');

        if(!Validator.isNumber(productData.price)) throw new Error('Price must be a number');
        if(Validator.isPrice(productData.price)) throw new Error('Product price must be greater then 0')
    }

    calculatePrice() {
        return this.price - (this.price * (this.discount/100))
    }
}

const ball = new SingleProduct({name: 'piłka', price: 100, category: 'zabawki', discount: 10});
const ball1 = new SingleProduct({name: 'piłka', price: 100, category: 'zabawki'});
const ball2 = new SingleProduct({name: 'piłka', price: 100, category: 'zabawki', discount: 30});
const cart = new ShoppingCart({discount: 10, discountCode: 'asdq23e12weas'});

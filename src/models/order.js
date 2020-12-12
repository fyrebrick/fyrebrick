const mongoose = require('mongoose');

const Order = new mongoose.Schema({
        order_id:Number,
        items:[
            [
                {
                    inventory_id:Number,
                    isChecked:Boolean,
                    item: {
                        no:String,
                        name:String,
                        type:String,
                        category_id:Number,
                    },
                    color_id:Number,
                    color_name:String,
                    quantity:Number,
                    new_or_used:String,
                    completeness:String,
                    unit_price: String,
                    unit_price_final:String,
                    disp_unit_price:String,
                    disp_unit_price_final:String,
                    currency_code:String,
                    disp_currency_code:String,
                    remarks:String,
                    description:String,
                    weight:String
                }
            ]
        ],
        consumer_key:String,
        description:String,
        orders_checked:Number,
        orders_total:Number,
        order_id : String,
        date_ordered : Date,
        date_status_changed : Date,
        seller_name : String,
        store_name : String,
        buyer_name : String,
        buyer_email : String,
        buyer_order_count : Number,
        require_insurance : Boolean,
        status : String,
        is_invoiced : Boolean,
        is_filled : Boolean,
        drive_thru_sent: Boolean,
        salesTax_collected_by_bl : Boolean,
        remarks : String,
        total_count : Number,
        unique_count: Number,
        total_weight:Number,
        payment:   {
            method: String,
            currency_code: String,
            date_paid: Date,
            status : String
        },
        shipping:{
            method: String,
            method_id:String,
            tracking_no: String,
            tracking_link: String,
            date_shipped: Date,
            address:{
                name: {
                    full:String,
                    first: String,
                    last: String
                },
                full: String,
                address1: String,
                address2: String,
                country_code: String,
                city: String,
                state:String,
                postal_code:String
            },
            cost:{
                currency_code:String,
                subtotal: Number,
                grand_total: Number,
                salesTax_collected_by_BL: Number,
                final_total:Number,
                etc1:Number,
                etc2:Number,
                insurance:Number,
                shipping:Number,
                credit:Number,
                coupon:Number,
                vat_rate:Number,
                vat_amount:Number
            },
            disp_cost:{
                currency_code:String,
                subtotal:Number,
                grand_total:Number,
                etc1:Number,
                etc2:Number,
                insurance:Number,
                shipping:Number,
                credit:Number,
                coupon:Number,
                vat_rate:Number,
                vat_amount:Number
            }
        }
    },
    { typeKey: '$type' }
);

const order = mongoose.model('Order', Order);


module.exports = order;


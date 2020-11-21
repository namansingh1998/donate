const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const SECRETKEY='sk_test_51Hpf8aHQ2OOVM97IQrfpq6SsdS8K9UyprM4SZJdSj16T74YAc4tn3ooovlFViCt858RFPEhghVZJubmxow2oSpBq00u8xQYNFC'
const stripe = require('stripe')(SECRETKEY)

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))

app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.static(path.join(__dirname, './views')));

app.post('/charge', (req, res) => {
    try {
        stripe.customers.create({
            name: req.body.name,
            email: req.body.email,
            source: req.body.stripeToken,
            address: { 
            line1: 'TC 9/4 Old MES colony', 
            postal_code: '452331', 
            city: 'Indore', 
            state: 'Madhya Pradesh', 
            country: 'India', 
        } 
        }).then(customer => stripe.charges.create({
            amount: req.body.amount * 100,
            currency: 'INR',
            customer: customer.id,
            description: 'Thank you for your generous donation.'
        })).then(() => res.render('complete.html'))
            .catch(err => console.log(err))
    } catch (err) { res.send(err) }
})


const port = process.env.PORT || 3000
app.listen(port, () => console.log('Server is running...'))


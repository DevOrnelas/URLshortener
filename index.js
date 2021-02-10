const express = require('express')
const app = express()
const ShortUrl = require('./models/shortUrl')
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/urlShortener', {
    useNewUrlParser: true, useUnifiedTopology: true
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: false}))

app.get('/', async (req, res, next)=>{
    const shortUrls = await ShortUrl.find() 
    res.render('index', { shortUrls: shortUrls })
})

app.post('/shortUrls', async (req, res, next)=>{
    await ShortUrl.create({full: req.body.fullUrl})
    res.redirect('/')
})

app.get('/:shortUrl', async (req, res, next)=>{
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
    if(shortUrl == null) return res.status(404)

    shortUrl.clicks++
    shortUrl.save()

    res.redirect(shortUrl.full)
})

app.listen(process.env.PORT || 5000);
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(express.static(path.join(__dirname, 'public')));

function getCurrentDateTime() {
    const now = new Date();
    return now.toISOString().replace('Z', '+08:00');
}

const EVONET_CONFIG = {
    INTERACTION_API: 'https://sandbox.evonetonline.com/interaction',
    PAYMENT_API: 'https://sandbox.evonetonline.com/payment',
    KEY_ID: 'kid_4e103f2ff33c45b39c8df9ee7c8d1336',
    SECRET_KEY: 'sk_sandbox_ef8e03d031e74642a36309f446074037'
};

const subscriptionPlans = [
    {
        id: 'basic',
        name: '基础版',
        nameEn: 'Basic',
        description: '适合个人用户，包含基础功能',
        price: 9.99,
        currency: 'USD',
        billingCycle: 'monthly',
        features: ['5GB 存储空间', '基础客服支持', '单设备登录', '标准画质']
    },
    {
        id: 'pro',
        name: '专业版',
        nameEn: 'Professional',
        description: '适合专业人士，功能全面升级',
        price: 29.99,
        currency: 'USD',
        billingCycle: 'monthly',
        features: ['50GB 存储空间', '优先客服支持', '5台设备同时登录', '高清画质', '高级数据分析'],
        popular: true
    },
    {
        id: 'enterprise',
        name: '企业版',
        nameEn: 'Enterprise',
        description: '适合企业团队，无限可能',
        price: 99.99,
        currency: 'USD',
        billingCycle: 'monthly',
        features: ['无限存储空间', '专属客服经理', '无限设备登录', '4K超高清画质', '高级数据分析', 'API接口访问', '定制化服务']
    }
];

const subscriptions = new Map();
const customers = new Map();
const customerTokens = new Map();
const orders = new Map();

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/demos', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/demos/linkpay-oneoff', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'demos', 'linkpay-oneoff', 'index.html'));
});

app.get('/demos/linkpay-subscription', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'demos', 'linkpay-subscription', 'index.html'));
});

app.get('/demos/dropin-oneoff', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'demos', 'dropin-oneoff', 'index.html'));
});

app.get('/demos/dropin-subscription', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'demos', 'dropin-subscription', 'index.html'));
});

app.get('/demos/directapi-oneoff', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'demos', 'directapi-oneoff', 'index.html'));
});

app.get('/demos/directapi-subscription', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'demos', 'directapi-subscription', 'index.html'));
});

app.get('/demos/linkpay-subscription/payment.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'demos', 'linkpay-subscription', 'subscription-payment.html'));
});

app.get('/demos/linkpay-subscription/checkout.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'demos', 'linkpay-subscription', 'checkout.html'));
});

app.get('/demos/linkpay-subscription/success.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'demos', 'linkpay-subscription', 'success.html'));
});

app.get('/demos/linkpay-subscription/error.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'demos', 'linkpay-subscription', 'error.html'));
});

app.get('/demos/directapi-subscription/checkout.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'demos', 'directapi-subscription', 'checkout.html'));
});

app.get('/demos/directapi-subscription/success.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'demos', 'directapi-subscription', 'success.html'));
});

app.get('/demos/directapi-subscription/error.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'demos', 'directapi-subscription', 'error.html'));
});

app.get('/demos/dropin-oneoff/success.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'demos', 'dropin-oneoff', 'success.html'));
});

app.get('/demos/dropin-subscription/subscription-payment.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'demos', 'dropin-subscription', 'subscription-payment.html'));
});

app.get('/demos/dropin-subscription/checkout.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'demos', 'dropin-subscription', 'checkout.html'));
});

app.get('/demos/dropin-subscription/success.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'demos', 'dropin-subscription', 'success.html'));
});

app.get('/demos/dropin-subscription/error.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'demos', 'dropin-subscription', 'error.html'));
});

app.get('/demos/dropin-subscription/subscription-management.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'demos', 'dropin-subscription', 'subscription-management.html'));
});

app.get('/demos/linkpay-oneoff/success.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'demos', 'linkpay-oneoff', 'success.html'));
});

app.get('/demos/linkpay-oneoff/error.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'demos', 'linkpay-oneoff', 'error.html'));
});

app.get('/demos/dropin-subscription/subscription-management.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'demos', 'dropin-subscription', 'subscription-management.html'));
});

app.get('/demos/dropin-subscription/success.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'demos', 'dropin-subscription', 'success.html'));
});

app.get('/demos/directapi-oneoff/error.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'demos', 'directapi-oneoff', 'error.html'));
});

app.get('/demos/dropin-subscription/success.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'demos', 'dropin-subscription', 'success.html'));
});

app.get('/demos/dropin-subscription/error.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'demos', 'dropin-subscription', 'error.html'));
});

app.get('/demos/dropin-subscription/success.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'demos', 'dropin-subscription', 'success.html'));
});

app.get('/demos/dropin-subscription/subscription-management.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'demos', 'dropin-subscription', 'subscription-management.html'));
});

app.get('/api/plans', (req, res) => {
    res.json({ success: true, plans: subscriptionPlans });
});

app.get('/api/plans/:planId', (req, res) => {
    const plan = subscriptionPlans.find(p => p.id === req.params.planId);
    if (plan) {
        res.json({ success: true, plan });
    } else {
        res.status(404).json({ success: false, error: 'Plan not found' });
    }
});

app.post('/api/create-payment', async (req, res) => {
    console.log('Received payment creation request:', req.body);
    try {
        const { orderId, amount, currency, reference } = req.body;
        
        const dateTime = getCurrentDateTime();
        
        const requestData = {
            merchantOrderInfo: {
                merchantOrderID: orderId || `ORD-${Date.now()}`,
                merchantOrderTime: dateTime
            },
            transAmount: {
                currency: currency || 'USD',
                value: amount || '100'
            },
            userInfo: {
                reference: reference || 'test_user'
            },
            validTime: 5,
            returnUrl: `${req.protocol}://${req.get('host')}/demos/linkpay-oneoff/success.html`,
            webhook: `${req.protocol}://${req.get('host')}/webhook`
        };
        
        console.log('Creating payment with data:', requestData);
        
        const response = await fetch(EVONET_CONFIG.INTERACTION_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': EVONET_CONFIG.SECRET_KEY,
                'DateTime': dateTime,
                'KeyID': EVONET_CONFIG.KEY_ID,
                'SignType': 'Key-based'
            },
            body: JSON.stringify(requestData)
        });
        
        console.log('API response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API error response:', errorText);
            throw new Error(`API request failed: ${response.status} ${errorText}`);
        }
        
        const result = await response.json();
        console.log('Payment API response:', result);
        
        const paymentUrl = result.linkUrl || result.paymentUrl || result.redirectUrl || result.url;
        console.log('Generated payment URL:', paymentUrl);
        
        orders.set(requestData.merchantOrderInfo.merchantOrderID, {
            orderId: requestData.merchantOrderInfo.merchantOrderID,
            amount: amount,
            currency: currency,
            status: 'pending',
            createTime: new Date().toISOString()
        });
        
        res.json({ success: true, paymentUrl, orderId: requestData.merchantOrderInfo.merchantOrderID });
    } catch (error) {
        console.error('Payment creation error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/create-dropin-session', async (req, res) => {
    console.log('Received dropin session creation request:', req.body);
    try {
        const { orderId, amount, currency, reference } = req.body;
        
        const dateTime = getCurrentDateTime();
        
        const requestData = {
            merchantOrderInfo: {
                merchantOrderID: orderId || `ORD-${Date.now()}`,
                merchantOrderTime: dateTime
            },
            transAmount: {
                currency: currency || 'USD',
                value: amount || '100'
            },
            userInfo: {
                reference: reference || 'test_user'
            },
            validTime: 5,
            returnUrl: `${req.protocol}://${req.get('host')}/demos/dropin-oneoff/success.html`,
            webhook: `${req.protocol}://${req.get('host')}/webhook`
        };
        
        console.log('Creating dropin session with data:', requestData);
        
        const response = await fetch(EVONET_CONFIG.INTERACTION_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': EVONET_CONFIG.SECRET_KEY,
                'DateTime': dateTime,
                'KeyID': EVONET_CONFIG.KEY_ID,
                'SignType': 'Key-based'
            },
            body: JSON.stringify(requestData)
        });
        
        console.log('API response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API error response:', errorText);
            throw new Error(`API request failed: ${response.status} ${errorText}`);
        }
        
        const result = await response.json();
        console.log('Dropin session API response:', JSON.stringify(result, null, 2));
        
        res.json({ 
            success: true, 
            sessionId: result.sessionID, 
            orderId: requestData.merchantOrderInfo.merchantOrderID,
            linkUrl: result.linkUrl
        });
    } catch (error) {
        console.error('Dropin session creation error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/direct-payment', async (req, res) => {
    console.log('Received direct payment request:', req.body);
    try {
        const { merchantTransID, amount, currency, paymentMethod, saveCard, customerId } = req.body;
        
        const dateTime = getCurrentDateTime();
        const transID = merchantTransID || `PAY-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        
        const requestData = {
            merchantTransInfo: {
                merchantTransID: transID,
                merchantTransTime: dateTime
            },
            transAmount: {
                currency: currency || 'USD',
                value: amount || '100'
            },
            paymentMethod: paymentMethod || { type: 'card' },
            captureAfterHours: '0',
            webhook: `${req.protocol}://${req.get('host')}/webhook`
        };
        
        if (saveCard && customerId) {
            requestData.paymentMethod.recurringProcessingModel = 'Subscription';
        }
        
        console.log('Creating direct payment with data:', JSON.stringify(requestData, null, 2));
        
        const response = await fetch(EVONET_CONFIG.PAYMENT_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': EVONET_CONFIG.SECRET_KEY,
                'DateTime': dateTime,
                'KeyID': EVONET_CONFIG.KEY_ID,
                'SignType': 'Key-based',
                'Idempotency-Key': transID
            },
            body: JSON.stringify(requestData)
        });
        
        const result = await response.json();
        console.log('Direct payment API response:', JSON.stringify(result, null, 2));
        
        if (result.result && result.result.code === 'S0000' && result.token) {
            if (customerId) {
                const tokenInfo = {
                    tokenValue: result.token.value,
                    customerId: customerId,
                    createdAt: new Date().toISOString(),
                    cardLast4: result.paymentMethod?.card?.last4 || '****',
                    cardBrand: result.paymentMethod?.card?.brand || 'Unknown'
                };
                customerTokens.set(customerId, tokenInfo);
                console.log('Token saved for customer:', customerId);
            }
        }
        
        res.json({ success: true, result, merchantTransID: transID });
    } catch (error) {
        console.error('Direct payment error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/subscription/create', async (req, res) => {
    try {
        const { planId, customerInfo, agreeTerms } = req.body;
        
        if (!agreeTerms) {
            return res.status(400).json({ success: false, error: '请同意隐私政策和服务条款' });
        }
        
        const plan = subscriptionPlans.find(p => p.id === planId);
        if (!plan) {
            return res.status(404).json({ success: false, error: '订阅方案不存在' });
        }
        
        const customerId = customerInfo.email ? 
            `CUS-${Buffer.from(customerInfo.email).toString('base64').substring(0, 12)}` : 
            `CUS-${Date.now()}`;
        
        const subscriptionId = `SUB-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        
        const now = new Date();
        const nextBillingDate = new Date(now);
        nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
        
        const subscription = {
            id: subscriptionId,
            customerId,
            customerInfo: {
                email: customerInfo.email || '',
                name: customerInfo.name || '',
                phone: customerInfo.phone || ''
            },
            plan,
            status: 'pending',
            createdAt: now.toISOString(),
            currentPeriodStart: now.toISOString(),
            currentPeriodEnd: nextBillingDate.toISOString(),
            nextBillingDate: nextBillingDate.toISOString(),
            billingCycle: plan.billingCycle,
            orderId,
            isFirstSubscription: true
        };
        
        subscriptions.set(subscriptionId, subscription);
        
        if (!customers.has(customerId)) {
            customers.set(customerId, {
                id: customerId,
                email: customerInfo.email || '',
                name: customerInfo.name || '',
                subscriptions: [],
                createdAt: now.toISOString()
            });
        }
        customers.get(customerId).subscriptions.push(subscriptionId);
        
        const dateTime = getCurrentDateTime();
        const apiRequestData = {
            merchantOrderInfo: {
                merchantOrderID: orderId,
                merchantOrderTime: dateTime
            },
            transAmount: {
                currency: plan.currency,
                value: plan.price.toString()
            },
            userInfo: {
                reference: customerId
            },
            paymentMethod: {
                recurringProcessingModel: 'Subscription'
            },
            validTime: 5,
            returnUrl: `${req.protocol}://${req.get('host')}/demos/linkpay-subscription/payment.html?subscriptionId=${subscriptionId}`,
            webhook: `${req.protocol}://${req.get('host')}/webhook/subscription`
        };
        
        const headers = {
            'Authorization': EVONET_CONFIG.SECRET_KEY,
            'DateTime': dateTime,
            'KeyID': EVONET_CONFIG.KEY_ID,
            'SignType': 'Key-based',
            'Content-Type': 'application/json'
        };
        
        let paymentUrl;
        let sessionId;
        try {
            const response = await fetch(EVONET_CONFIG.INTERACTION_API, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(apiRequestData)
            });
            
            const apiResponse = await response.json();
            console.log('Interaction API response:', JSON.stringify(apiResponse, null, 2));
            
            sessionId = apiResponse.sessionID || apiResponse.sessionId;
            paymentUrl = apiResponse.linkUrl || apiResponse.paymentUrl || 
                `https://sandbox.evonetonline.com/payment/pay?orderId=${orderId}&amount=${plan.price}&currency=${plan.currency}`;
        } catch (error) {
            console.error('API call error:', error);
            paymentUrl = `https://sandbox.evonetonline.com/payment/pay?orderId=${orderId}&amount=${plan.price}&currency=${plan.currency}`;
        }
        
        subscription.paymentUrl = paymentUrl;
        subscription.sessionId = sessionId;
        
        res.json({ 
            success: true, 
            subscription,
            paymentUrl,
            sessionId,
            orderId,
            customerId,
            message: '请在支付页面勾选"Save card details for next time"以保存卡片信息用于后续自动扣费'
        });
    } catch (error) {
        console.error('Subscription creation error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/subscription/:subscriptionId', (req, res) => {
    const subscription = subscriptions.get(req.params.subscriptionId);
    if (subscription) {
        res.json({ success: true, subscription });
    } else {
        res.status(404).json({ success: false, error: 'Subscription not found' });
    }
});

app.post('/api/subscription/:subscriptionId/activate', (req, res) => {
    const subscription = subscriptions.get(req.params.subscriptionId);
    if (!subscription) {
        return res.status(404).json({ success: false, error: 'Subscription not found' });
    }
    
    subscription.status = 'active';
    subscription.activatedAt = new Date().toISOString();
    
    res.json({ success: true, subscription });
});

app.post('/api/subscription/:subscriptionId/cancel', (req, res) => {
    const subscription = subscriptions.get(req.params.subscriptionId);
    if (!subscription) {
        return res.status(404).json({ success: false, error: 'Subscription not found' });
    }
    
    subscription.status = 'cancelled';
    subscription.cancelledAt = new Date().toISOString();
    
    res.json({ success: true, subscription, message: '订阅已取消，将在当前计费周期结束后生效' });
});

app.post('/api/subscription/:subscriptionId/direct-payment', async (req, res) => {
    console.log('Received subscription direct payment request:', req.body);
    try {
        const subscription = subscriptions.get(req.params.subscriptionId);
        if (!subscription) {
            return res.status(404).json({ success: false, error: 'Subscription not found' });
        }
        
        const { paymentMethod, saveCard } = req.body;
        const plan = subscription.plan;
        const dateTime = getCurrentDateTime();
        
        const merchantTransID = `PAY-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        
        const requestData = {
            merchantTransInfo: {
                merchantTransID: merchantTransID,
                merchantTransTime: dateTime
            },
            transAmount: {
                currency: plan.currency,
                value: plan.price.toString()
            },
            paymentMethod: {
                ...paymentMethod,
                recurringProcessingModel: 'Subscription'
            },
            userInfo: {
                reference: subscription.customerId
            },
            captureAfterHours: '0',
            allowAuthentication: true,
            returnURL: `${req.protocol}://${req.get('host')}/demos/directapi-subscription/success.html?subscriptionId=${subscription.id}`,
            webhook: `${req.protocol}://${req.get('host')}/webhook/subscription`
        };
        
        console.log('Creating subscription direct payment with data:', JSON.stringify(requestData, null, 2));
        
        const response = await fetch(EVONET_CONFIG.PAYMENT_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': EVONET_CONFIG.SECRET_KEY,
                'DateTime': dateTime,
                'KeyID': EVONET_CONFIG.KEY_ID,
                'SignType': 'Key-based',
                'Idempotency-Key': merchantTransID
            },
            body: JSON.stringify(requestData)
        });
        
        const result = await response.json();
        console.log('Subscription direct payment API response:', JSON.stringify(result, null, 2));
        
        if (result.result && result.result.code === 'S0000') {
            if (result.token && result.token.value) {
                const tokenInfo = {
                    tokenValue: result.token.value,
                    customerId: subscription.customerId,
                    createdAt: new Date().toISOString(),
                    cardLast4: result.paymentMethod?.card?.last4 || '****',
                    cardBrand: result.paymentMethod?.card?.brand || 'Unknown'
                };
                customerTokens.set(subscription.customerId, tokenInfo);
                console.log('Token saved for customer:', subscription.customerId);
            }
            
            subscription.status = 'active';
            subscription.activatedAt = new Date().toISOString();
            subscription.isFirstSubscription = false;
            subscription.merchantTransID = merchantTransID;
            
            res.json({ 
                success: true, 
                result,
                subscription,
                message: '支付成功，订阅已激活'
            });
        } else {
            res.json({ 
                success: false, 
                result,
                message: result.result?.message || '支付失败'
            });
        }
    } catch (error) {
        console.error('Subscription direct payment error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/customer/:customerId/subscriptions', (req, res) => {
    const customer = customers.get(req.params.customerId);
    if (!customer) {
        return res.status(404).json({ success: false, error: 'Customer not found' });
    }
    
    const customerSubscriptions = customer.subscriptions
        .map(subId => subscriptions.get(subId))
        .filter(sub => sub !== undefined);
    
    const tokenInfo = customerTokens.get(req.params.customerId);
    
    res.json({ 
        success: true, 
        subscriptions: customerSubscriptions,
        hasToken: !!tokenInfo,
        tokenInfo: tokenInfo ? { 
            createdAt: tokenInfo.createdAt,
            cardLast4: tokenInfo.cardLast4 
        } : null
    });
});

app.get('/api/order/:orderId', (req, res) => {
    const order = orders.get(req.params.orderId);
    if (order) {
        res.json({ success: true, order, queryType: 'order' });
    } else {
        res.json({ success: true, order: { 
            merchantOrderID: req.params.orderId,
            status: 'Paid',
            createTime: new Date().toISOString()
        }, queryType: 'order' });
    }
});

app.post('/api/refund', async (req, res) => {
    console.log('Received refund request:', req.body);
    try {
        const { merchantTransID, amount, currency } = req.body;
        
        const refundTransID = `REFUND-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        
        res.json({ 
            success: true, 
            refund: {
                merchantTransID: refundTransID,
                originalTransID: merchantTransID,
                amount: amount,
                currency: currency,
                status: 'Pending',
                createTime: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Refund error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/webhook', (req, res) => {
    console.log('Webhook received:', req.body);
    res.send('SUCCESS');
});

app.post('/webhook/subscription', (req, res) => {
    console.log('=== Subscription webhook received ===');
    console.log('Webhook body:', JSON.stringify(req.body, null, 2));
    
    const webhookData = req.body;
    
    if (webhookData.result && webhookData.result.code === 'S0000') {
        const merchantOrderID = webhookData.merchantOrderInfo?.merchantOrderID;
        const userInfo = webhookData.userInfo;
        const customerId = userInfo?.reference;
        
        if (webhookData.token && webhookData.token.value) {
            console.log('Token received:', webhookData.token.value);
            
            const tokenInfo = {
                tokenValue: webhookData.token.value,
                customerId: customerId,
                createdAt: new Date().toISOString(),
                cardLast4: webhookData.paymentMethod?.card?.last4 || '****',
                cardBrand: webhookData.paymentMethod?.card?.brand || 'Unknown'
            };
            
            customerTokens.set(customerId, tokenInfo);
            console.log('Token saved for customer:', customerId);
        }
        
        for (const [subId, subscription] of subscriptions) {
            if (subscription.orderId === merchantOrderID && subscription.status === 'pending') {
                subscription.status = 'active';
                subscription.activatedAt = new Date().toISOString();
                subscription.isFirstSubscription = false;
                
                if (webhookData.transactionInfo?.merchantTransInfo?.merchantTransID) {
                    subscription.merchantTransID = webhookData.transactionInfo.merchantTransInfo.merchantTransID;
                }
                
                console.log('Subscription activated:', subId);
                break;
            }
        }
    }
    
    res.json({ success: true, message: 'Webhook received' });
});

app.get('/success', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'demos', 'linkpay-subscription', 'success.html'));
});

app.get('/error', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'demos', 'linkpay-subscription', 'error.html'));
});

app.listen(PORT, () => {
    console.log(`========================================`);
    console.log(`  Evonet Demos Site`);
    console.log(`  Port: ${PORT}`);
    console.log(`  URL: http://localhost:${PORT}`);
    console.log(`========================================`);
});

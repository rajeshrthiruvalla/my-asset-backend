const SmsTemplate=require('../model/SmsTemplate')
const TemplateSelection=require('../model/TemplateSelection')
const Sender=require('../model/Sender')
const Request=require('../model/Request')

const createTemplate=async (req,res)=>{
    const userId= req.token.userId;

    const { sms,data,type } = req.body;
    let template=sms;
     for (let key in data) {
        template=template.replace(data[key],'{'+key+'}')
        }
    
    const smsTemplate=new SmsTemplate({sms,template,type,userId});
    await smsTemplate.save();
    res.json({
            message: `Template created`,
            data:smsTemplate
        });
}

const setAccounts=async (req,res)=>{
    const userId= req.token.userId;
    const { templateId,from,to,fromId,toId,type } = req.body;
    let templateSelection=await TemplateSelection.findOne({templateId,userId});
    if(templateSelection)
    {     
        templateSelection.fromId=fromId;     
        templateSelection.toId=toId;         
        templateSelection.type=type; 
        templateSelection.save();       
    }else{
        templateSelection=new TemplateSelection({ templateId,from,to,fromId,toId,type,userId});
        await templateSelection.save();
    }
    res.json({
            message: `Account Selection completed`,
            data:templateSelection
        });
}
const splitIntwo=(key,input)=>{    // e.g. "{"
  const index = input.indexOf(key); // find where it appears
  if (index === -1) {
    // key not found → return whole string as first part
    return [input, ''];
  }

  const firstPart  = input.slice(0, index); // includes "{sender}"
  const secondPart = input.slice(index+1);     // everything after
  return [firstPart, secondPart];
}
const splitIntwoString=(key,input)=>{    // e.g. "{"
  const index = input.indexOf(key); // find where it appears
  if (index === -1) {
    // key not found → return whole string as first part
    return [input, ''];
  }

  const firstPart  = input.slice(0, index); // includes "{sender}"
  const secondPart = input.slice(index+key.length);     // everything after
  return [firstPart, secondPart];
}
const smsToData=async(sms)=>{
    const smsTemplates = await SmsTemplate.find({
            type: { $in: ['income', 'expense', 'transfer'] }
            });
            // console.log(smsTemplates);
            // console.log(sms)
    let templates=smsTemplates.map((item)=>{
                            const words=[];
                            const keys=[];
                            let rest=item.template;
                            while(rest)
                            {
                                const split1 = splitIntwo('{',rest);
                                let first =split1[0];
                                rest=split1[1];
                                words.push(first);
                                const split2 = splitIntwo('}',rest);
                                let key =split2[0];
                                rest=split2[1];
                                keys.push(key);
                            }
                            return {words,keys,type:item.type,templateId:item._id,sms:item.sms};
                        });
    templates= templates.filter(template=>{
        return template.words.every(word => sms.includes(word));
    });
    if(templates.length==0)
    {
        return {success:false}
    }
    const template=templates[0];
    const words=template.words;
    const keys=template.keys;
    const data={'type':template.type,'templateId':template.templateId};
    let input=sms;
    for(let i=0;i<=words.length;i++)
    {
        let word=words[i];


        const split=splitIntwoString(word,input);
        let part1=split[0];
        input=split[1];
        if(i==0)
        {
           continue;
        }
        let key=keys[i-1];
        data[key]=part1;
    }
    return {success:true,data};
}
const filterSms=async (req,res)=>{
    const { sms } = req.body;
    const result=await smsToData(sms);
    if(result.success)
    {
       return res.json({
                    message: `Filtered values`,
                    data:result.data
                });
    }
    return res.status(400).json({
        message: `Template not found`,
    });
}

const getAccount=async (req,res)=>{
    const userId= req.token.userId;
    const { templateId } = req.body;
    const smsTemplate=await TemplateSelection.findOne({templateId,userId});
        res.json({
            message: `Template Selections`,
            data:smsTemplate
        });
}

const getSenders = async (req,res) => {
    const userId= req.token.userId;
    const senders=await Sender.find({});
        res.json({
            message: `Senders List`,
            data:senders
        });
}

const addSenders = async (req, res) => {
  try {
    const userId = req.token.userId;
    const { title,status } = req.body;

    if (!title) {
      return res.status(400).json({
        status: false,
        message: "Sender is required",
      });
    }
    let SenderItem=await Sender.findOne({title});
    if(SenderItem)
    {
      SenderItem.status=status;
      await SenderItem.save();
    }else{
      SenderItem = await Sender.create({
                    userId,
                    title,
                    status
                });
    }


    res.json({
      status: true,
      message: "Sender added successfully",
      data: SenderItem,
    });

  } catch (error) {

    console.error(error);
    res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
}

const addRequests = async (req, res) => {
  try {
    const userId = req.token.userId;
    const { title,sms,status,id } = req.body;

    if (!title) {
      return res.status(400).json({
        status: false,
        message: "Sender is required",
      });
    }
    if (!sms) {
      return res.status(400).json({
        status: false,
        message: "SMS is required",
      });
    }
     let RequestItem = await Request.create({
                    userId,
                    title,
                    sms,
                    status,
                    requestId:id
                });


    res.json({
      status: true,
      message: "SMS added successfully",
      data: RequestItem,
    });

  } catch (error) {

    console.error(error);
    res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
}

const listRequest = async (req, res) => {
  try {
    const requests = await Request.find({
      processed: { $ne: 1 }
    }).populate("userId", "name email");

    // render EJS page and pass data
    res.render("PendingRequest", {
      requests  // same as requests: requests
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

const processRequest = async (req, res) => {
    try {
    const { id } = req.query;

    const request = await Request.findById(id).populate("userId", "name email");

    if(request.status==0)
    {
        //ignore
         const smsTemplates=await SmsTemplate.find({type:'ignore'});
         const smsTemplate=smsTemplates.find((item)=>item.words.every((word)=>request.sms.includes(word)));
         if(smsTemplate)
         {
                // Update Request as processed
                await Request.findByIdAndUpdate(id, {
                processed: 1
                });

                return res.redirect("/list-sms-request");           
         }
    }else if(request.status==1)
    {
          const resp=await smsToData(`Sender ${request.title}: ${request.sms}`);
          if(resp.success)
          {
              await Request.findByIdAndUpdate(id, {
                processed: 1
                });

                return res.redirect("/list-sms-request"); 
          }
        request.template='{"data":{"sender":"VA-FEDBNK-S","amount":"299.00","date":"01-12-2025","time":"16:55:47","to":"maria.antony4-1","txnno":"533572482895","from":"Federal Bank"},"type":"expense"}';
    }
    if (!request) {
      return res.status(404).send("Request not found");
    }

    res.render("ProcessRequest", {
      request
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

const processRequestPost = async (req, res) => {
  try {
    const { id, sms, template, action } = req.body;

    if (!id) return res.status(400).send("Missing request id");

    if (action === "ignore") {
      // Split template by comma
      const words = template.split(",").map(w => w.trim()).filter(Boolean);
      const smsTemplates=await SmsTemplate.find({type:'ignore'});
     const exist=smsTemplates.find((item)=>words.every(word => item.sms.includes(word)))
     if(exist)
     {

     }else{
      // Save ignore entry
      await SmsTemplate.create({
        sms: sms,
        words: words,
        type: "ignore"
      });

     }

    } else {
        console.log(template);
       const input= JSON.parse(template)
       const data=input.data;
       const type=input.type;
        let stemplate=sms;
        for (let key in data) {
            stemplate=stemplate.replace(data[key],'{'+key+'}')
            }
        const smsTemplate=new SmsTemplate({sms,template:stemplate,type});
        await smsTemplate.save();
    }

    // Update Request as processed
    await Request.findByIdAndUpdate(id, {
      processed: 1
    });

    return res.redirect("/list-sms-request");

  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
};

const getProcessedRequestIds=async (req,res)=>{
    const userId= req.token.userId;
        const ids = await Request.find(
        { processed: 1,userId },       // filter
        { requestId: 1, _id: 0 } // projection → only requestId
        ).then(res => res.map(r => r.requestId));
    res.json({
      status: true,
      message: "Ids",
      data: ids,
    });
}

const getIgnoredTemplates=async (req,res)=>{
   const words = await SmsTemplate.find(
        { type: 'ignore' },       // filter
        { words: 1, _id: 0 } // projection → only requestId
        ).then(res => res.map(r => r.words));
 res.json({
      status: true,
      message: "Words",
      data: words,
    });
}
module.exports={createTemplate,setAccounts,filterSms,getAccount,addSenders,getSenders,addRequests,listRequest,processRequest,processRequestPost,getProcessedRequestIds,getIgnoredTemplates}
const SmsTemplate=require('../model/SmsTemplate')
const TemplateSelection=require('../model/TemplateSelection')

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
const filterSms=async (req,res)=>{
    const userId= req.token.userId;
    const { sms } = req.body;
    const smsTemplates=await SmsTemplate.find({});
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
                            return {words,keys,type:item.type,templateId:item._id};
                        });
    templates= templates.filter(template=>{
        return template.words.every(word => sms.includes(word));
    });
    if(templates.length==0)
    {
        return res.json({
            message: `Template not found`,
        },400);
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
    res.json({
            message: `Filtered values`,
            data
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
module.exports={createTemplate,setAccounts,filterSms,getAccount}
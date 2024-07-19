class ApiFeatures{
    constructor(query,queryString){
        this.query=query;
        this.queryString=queryString;
    }

     filter(){
        //1A) simple filtering
        let newQuery={...this.queryString};
        console.log(newQuery);
        let exclude=['page','sort','limit','fields'];
        exclude.forEach(val=>delete newQuery[val]);

        // let query2=Tour.find().where('duration').equals(5)
        //            .where('difficulty').equals('easy');

        //1B) advance filtering
        let advQuery=JSON.stringify(newQuery);
        
        advQuery=advQuery.replace(/\b(gte|gt|lte|lt)\b/g,match=>`$${match}`);
        advQuery= JSON.parse(advQuery);
        
        this.query= this.query.find(advQuery);

        return this;
    }

    sort(){
        if(this.queryString.sort){
            let sortQuery=this.queryString.sort.split(',').join(' ');
           this.query=this.query.sort(sortQuery);
        }
        else{
           this.query=this.query.sort('-createdAt');
        }
        return this;
    }

    fields(){
        if(this.queryString.fields){
            let fieldQuery=this.queryString.fields.split(',').join(' ');
            this.query=this.query.select(fieldQuery);
        }
        return this;
    }

    pagination(){
        const page=+this.queryString.page ||1;
        const limit=+this.queryString.limit ||100;
        
        const skip=(page-1)*limit;
        console.log(skip);

       
        this.query=this.query.skip(skip).limit(limit);

        return this;
    }
}

module.exports=ApiFeatures;
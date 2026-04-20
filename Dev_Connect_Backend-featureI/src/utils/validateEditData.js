const validateEditData =(req)=>{
        const {name,age,photoUrl}=req.body;
        if(!name || !age || !photoUrl){
            throw new Error("Some fields are missing or invalid");
        }
        if(age<18){
            throw new Error("Age must be greater than 18");
        }

}
    module.exports = {validateEditData};

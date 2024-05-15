//function based components

//PascalCasing
function Message(){

    const name = 'dog lovers';

    function getName() :string {
        return name;
    }

    if (getName())
        return <h1 style={{ color: 'black', fontSize: '40px' , marginLeft: 650}}>Hello {getName()}</h1>     //merge si doar name  //it gets converted to javascript code
    else
        return <h1>Hello World</h1>
}

export default Message;
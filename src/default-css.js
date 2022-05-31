const response = await fetch("../themes/default.css");
        
if (!response.ok) {
    throw Error(response);
}
const defaultCSS = await response.text();

export default defaultCSS;

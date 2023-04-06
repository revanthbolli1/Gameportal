function toggleDropdown() {
    dropdown = document.getElementById("myDropdown");
    arrow = document.getElementById("arrow-up");

    if(dropdown.style.display=="block"){
        dropdown.style.display="none";
        arrow.style.display="none";
    }
    else{
        dropdown.style.display="block";
        arrow.style.display="block";
    }
}
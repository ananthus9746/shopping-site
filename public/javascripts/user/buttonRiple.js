const button = document.querySelector('.button')

function materializeEffect(event){
  const circle = document.createElement('div')
  const x = event.layerX
  const y = event.layerY
  circle.classList.add('circle')
  circle.style.left = `${x}px`
  circle.style.top = `${y}px`
  this.appendChild(circle)
}

button.addEventListener('click', materializeEffect)
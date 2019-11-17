const checkWinner = document.querySelector("#checkWinner");
const clearPool = document.querySelector("#clearPool");
const currentWinner = document.querySelector("#currentWinner");

checkWinner.addEventListener('click', () => {
    fetch("footballWinner")
        .then(res => res.json())
        .then(response => {
            currentWinner.textContent = `${response.person} won with a total of ${response.totalWins} wins!`;
        })
        .catch(err => console.log(err));
});

clearPool.addEventListener('click', () => {
    fetch('clearPool', {
        method: 'delete'
      })
      .then(() => {
        window.location.reload(true)
      });
});

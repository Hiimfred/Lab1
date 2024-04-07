fetch('/recipes')
    .then(response => response.json())
    .then(recipes => {
        const body = document.getElementById('recipe-table-body')
        recipes.forEach(recipes => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${recipes.title}</td>
                <td>${recipes.ingredients}</td>
                <td>${recipes.instructions}</td>
                <td>${recipes.cookingTime}</td>
            `;
            body.appendChild(row);
        })
    })
.catch(err => console.error('Error fetching recipes', err))
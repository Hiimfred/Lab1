
    fetch('/recipes')
        .then(response => response.json())
        .then(recipes => {
            const body = document.getElementById('recipe-table-body')
            recipes.forEach(recipe => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${recipe.title}</td>
                    <td>${recipe.ingredients}</td>
                    <td>${recipe.instructions}</td>
                    <td>${recipe.cookingTime} minutes</td>
                    <td>
                        <button class="delete-btn" data-title="${recipe.title}"> Delete </button>
                        <button class="update-btn" data-title="${recipe.title}"> Update </button>
                    </td>
                `;
                body.appendChild(row);
            })

            const deleteButton = document.querySelectorAll('.delete-btn');
            deleteButton.forEach(button => {
                button.addEventListener('click', () => {
                    const deleteTitle = button.getAttribute('data-title')
                    if (confirm(`Are you sure you want to delete the recipe ${ deleteTitle }`))
                        deleteRecipe(deleteTitle)
                });
            });

        // work in progress för updatering av recepted
        const updateButton = document.querySelectorAll('.update-btn');
        updateButton.forEach(button => {
            button.addEventListener('click', () => {
                const updateTitle = button.getAttribute('data-title')
                window.location.href = `/updateForm.html?title=${encodeURIComponent(updateTitle)}`
            });
        }); 
    })
    .catch(err => console.error('Error fetching recipes', err))


//funciton för att DELETE ett recept med title (fetchar)
async function deleteRecipe(title) {
    try {
        const response = await fetch(`/recipes/${encodeURIComponent(title)}`, {
            method: 'DELETE'
        });
        const data = await response.json();

        if (response.ok) {
            console.log(data.message)
            const del = document.querySelector(`[data-title="${ title }"]`).closest('tr');
            del.remove();
        } else {
            console.error('Error: ', data.message);
        }
    } catch (err) {
        console.error('Error deleting recipe: ', err)
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#recipe_form');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = {
            title: form.title.value,
            ingredients: form.ingredients.value.split('\n'),
            instructions: form.instructions.value,
            cookingTime: form.cookingTime.value
        };


        try {
            const response = await fetch('/recipes', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const data = await response.json();
                alert('Recipe added successfully')
            } else {
                console.error('Failed to add recipe: ', data.message)
            }
        } catch (err) {
            console.error('Errora adding recipe: ', err)
        }
    })
})

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const title = urlParams.get('title');

    document.getElementById('title').value = title;

    const updateForm = document.getElementById('update_form');

    updateForm.addEventListener('submit', async (event) => {
        event.preventDefault();
    
        const formData = {
            title: document.getElementById('title').value,
            ingredients: document.getElementById('ingredients').value.split('\n'),
            instructions: document.getElementById('instructions').value,
            cookingTime: document.getElementById('cookingTime').value
        };

        try {
            const response = await fetch(`/recipes/${encodeURIComponent(title)}`, {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const data = await response.json();
                alert('Recipe updated!')
            } else {
                console.error('Failed to update recipe: ', response.statusText);
            }
        } catch (err) {
            console.error('Error updating recipe', err)
        }
    })
})
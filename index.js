fetch('http://localhost:3000/color')
    .then(response => response.json())
    .then(data => {
        const container = document.querySelector("#themes-container");
        data.map(theme => {
            const id = theme.id;
            const colors = theme.colors;

            const card = document.createElement('div');
            card.classList.add("card", "shadow-sm");

            const cardBody = document.createElement('div');
            cardBody.classList.add("card-body");

            const cardTitle = document.createElement('h5');
            cardTitle.classList.add("card-title", "mb-4");
            cardTitle.textContent = theme.name;

            const buttonDiv = document.createElement('div');
            buttonDiv.classList.add("button-div", "d-flex", "gap-2", "flex-wrap");

            const applyButton = document.createElement('button');

            applyButton.textContent = "Aplicar tema";
            applyButton.classList.add("btn", "btn-success","shadow-sm");
            applyButton.setAttribute('id', `buttonTheme${id}`);
            applyButton.addEventListener('click', function() {
                applyTheme(colors.primary, colors.secondary, colors.success, colors.danger, colors.warning);
            });
            
              const deleteButton = document.createElement('button');
              deleteButton.textContent = "Excluir tema";
              deleteButton.classList.add("btn", "btn-danger", "shadow-sm");
              deleteButton.addEventListener('click', function() {  
                 deleteTheme(id); 
             });

            const editButton = document.createElement('button');
            editButton.textContent = "Editar tema";
            editButton.classList.add("btn", "btn-primary", "shadow-sm");
            editButton.addEventListener('click', function() {
              window.location.href = `editCreate.html?editThemeId=${id}`;
            });

            buttonDiv.appendChild(applyButton);
            buttonDiv.appendChild(deleteButton);
            buttonDiv.appendChild(editButton);

            cardBody.appendChild(cardTitle);
            cardBody.appendChild(buttonDiv);

            card.appendChild(cardBody);
            container.appendChild(card);
        });
    })
    .catch(error => {
        console.error('Erro ao carregar o arquivo JSON:', error);
    });


    function applyTheme(primaryColor, secondaryColor, successColor, dangerColor, warningColor) {
      const colorElements = {
          "color1": primaryColor,
          "color2": secondaryColor,
          "color3": successColor,
          "color4": dangerColor,
          "color5": warningColor
      };
  
      Object.keys(colorElements).forEach(colorId => {
          const element = document.getElementById(colorId);
          if (element) {
              element.style.color = colorElements[colorId];
          } else {
              console.error(`Element with ID ${colorId} not found.`);
          }
      });

      currentThemeId = themeId;

  }

  let currentThemeId = null;


  function isThemeApplied(themeId) {
    const currentThemeId = getCurrentThemeId();
    return currentThemeId && currentThemeId.toString() === themeId.toString();
}

function getCurrentThemeId() {
  const themeElement = document.querySelector('[data-theme-id]');
  if (themeElement && themeElement.hasAttribute('data-theme-id')) {
      return themeElement.getAttribute('data-theme-id');
  } else {
      return null;
  }
}


function deleteTheme(themeId) {
  if (isThemeApplied(themeId)) {
      console.log("O tema está sendo aplicado e não pode ser excluído.");
      return; 
  }

  // Excluir o tema
  fetch(`http://localhost:3000/color/${themeId}`, {
      method: 'DELETE'
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Erro ao excluir o tema');
      }
      console.log('Tema excluído com sucesso:', themeId);
      window.location.reload(); 
  })
  .catch(error => {
      console.error('Erro ao excluir o tema:', error);
  });
}


window.onload = function() {
  const urlParams = new URLSearchParams(window.location.search);
  const editThemeId = urlParams.get('editThemeId');
 
  if (editThemeId) {
       fetch(`http://localhost:3000/color/${editThemeId}`)
           .then(response => response.json())
           .then(theme => {
               document.getElementById('nameTheme').value = theme.name;
               document.getElementById('primaryColor').value = theme.colors.primary;
               document.getElementById('secondaryColor').value = theme.colors.secondary;
               document.getElementById('successColor').value = theme.colors.success;
               document.getElementById('dangerColor').value = theme.colors.danger;
               document.getElementById('warningColor').value = theme.colors.warning;
 
        
               document.getElementById('editTheme').addEventListener('click', function(event) {
                  event.preventDefault(); 
                  
                  const updatedTheme = {
                       name: document.getElementById('nameTheme').value,
                       colors: {
                           primary: document.getElementById('primaryColor').value,
                           secondary: document.getElementById('secondaryColor').value,
                           success: document.getElementById('successColor').value,
                           danger: document.getElementById('dangerColor').value,
                           warning: document.getElementById('warningColor').value
                       }
                  };
 
              
                  fetch(`http://localhost:3000/color/${editThemeId}`, {
                       method: 'PUT',
                       headers: {
                           'Content-Type': 'application/json'
                       },
                       body: JSON.stringify(updatedTheme)
                  })
                  .then(response => {
                       if (!response.ok) {
                           throw new Error('Erro ao atualizar o tema');
                       }
                       return response.json();
                  })
                  .then(data => {
                       console.log('Tema atualizado com sucesso:', data);
                       // Aqui você pode adicionar lógica para atualizar a interface do usuário, se necessário
                       window.location.href = "index.html";
                  })
                  .catch(error => {
                       console.error('Erro ao atualizar o tema:', error);
                  });
               });
           })
           .catch(error => console.error('Erro ao buscar o tema:', error));
  }
 };


document.getElementById('addThemeButton').addEventListener('click', function(event) {
  event.preventDefault(); 
  const nameTheme = document.getElementById('nameTheme').value;
  const primaryColor = document.getElementById('primaryColor').value;
  const secondaryColor = document.getElementById('secondaryColor').value;
  const successColor = document.getElementById('successColor').value;
  const dangerColor = document.getElementById('dangerColor').value;
  const warningColor = document.getElementById('warningColor').value;

 
  const newThemeId = Math.floor(Math.random() * 1000);
  const newTheme = {
      "id": newThemeId,
      "name": nameTheme,
      "colors": {
          "primary": primaryColor,
          "secondary": secondaryColor,
          "success": successColor,
          "danger": dangerColor,
          "warning": warningColor
      }
  };


  fetch('http://localhost:3000/color', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(newTheme)
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('Erro ao adicionar novo tema');
          }
          return response.json();
      })
      .then(newThemeWithId => {
          console.log('Novo tema adicionado com sucesso:', newThemeWithId);
          window.location.href = "index.html";
      })
      .catch(error => {
          console.error('Erro ao adicionar novo tema:', error);
      });
});


function searchThemes() {
  const searchInput = document.getElementById('searchInput').value.toLowerCase(); 
  const themes = document.querySelectorAll('.card-title'); 

  themes.forEach(theme => {
      const themeName = theme.textContent.toLowerCase(); 
      if (themeName.includes(searchInput)) { 
          theme.parentElement.parentElement.style.display = 'block';
      } else {
          theme.parentElement.parentElement.style.display = 'none';
      }
  });
}
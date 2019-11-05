// Model

let modelController = (function () {

  //calculate todo percentage

  // Handle Event Listeners method
  let addEventListenerToTasks = function (list, method, type = '') {
    let key = Array.isArray(type) ? 'array' : type
    let tmpMthod = []
    if (key == 'array' && !Array.isArray(method)) {
      for (let i = 0; i < type.length; i++) {
        tmpMthod.push(method);
      }
      method = tmpMthod
    }
    if (list != window) {
      list.forEach(e => {
        switch (key) {
          case 'array':
            e.addEventListener(`${type[0]}`, method[0]);
            e.addEventListener(`${type[1]}`, method[1]);
            break;
          default:
            e.addEventListener('click', method);
            break;
        }
      })
    } else {
      for (key in type) {
        list.addEventListener(`${type[key]}`, method[key])
      }

    }

  }

  let taskCheck = (e, DOM) => {
    if (e.target.checked) {
      if (e.target.parentElement.classList.contains('task')) {
        let projectId = e.target.parentElement.getAttribute('project-id');
        let taskId = e.target.parentElement.getAttribute('task-id');
        let lastElem = e.target.parentElement.querySelector('.task-title');
        lastElem.classList.add('task-cleared');
        DOM.projects_holder.map(p => {
          if (p.id == projectId) {
            p.tasks_list.map(t => {
              if (t.id == taskId) {
                t.complete = e.target.checked;
              }
            })
          }
        })
      }
    } else {
      if (e.target.parentElement.classList.contains('task')) {
        let projectId = e.target.parentElement.getAttribute('project-id');
        let taskId = e.target.parentElement.getAttribute('task-id');
        let lastElem = e.target.parentElement.querySelector('.task-title');
        lastElem.classList.remove('task-cleared');
        DOM.projects_holder.map(p => {
          if (p.id == projectId) {
            p.tasks_list.map(t => {
              if (t.id == taskId) {
                t.complete = e.target.checked;
              }
            })
          }
        })
      }
    }
  }
  function scrollIntoView(div) {
    div.scrollIntoView({ block: 'end', behavior: 'smooth' })
  }
  let addTasks = ({ addTask, taskListContainer, projects_holder, deleteIconSvg }) => {
    let value = addTask.value;
    addTask.value = ''
    addTask.focus()
    id = addTask.getAttribute('project-id');
    if (value !== '' && value.trim() !== '') {
      if (!(id >= 1)) {
        toastr.error('Please create Project or select if already exist')
        return
      }
      let taskId = Math.random(10) * 36;
      let divWrapper = document.createElement('div')
      divWrapper.classList.add('taskWrapper');
      let div = document.createElement('div');
      let input = document.createElement('input');
      let h3 = document.createElement('h3');
      let span = document.createElement('span');
      div.classList.add('task');
      div.setAttribute('task-id', taskId)
      div.setAttribute('project-id', id)
      input.id = 'checkbox'
      input.type = 'checkbox'
      input.name = value;
      h3.classList.add('task-title');
      h3.innerText = value
      h3.contentEditable = true
      span.classList.add('delete-btn');
      span.innerHTML = deleteIconSvg
      div.appendChild(input);
      div.appendChild(h3);
      div.appendChild(span)
      divWrapper.appendChild(div)
      taskListContainer.appendChild(divWrapper)
      let task = { name: value, complete: input.checked, id: taskId }
      projects_holder.map(p => {
        if (p.id == id) {
          p.tasks_list.push({ ...task })
        }
      })
      scrollIntoView(div);
      toastr.success('New Task Added')

    } else {
      toastr.error('Make sure Task is not empty')
    }

  }

  let initTasks = (project_id, { taskListContainer, projects_holder, deleteIconSvg }) => {
    if (project_id == null) {
      taskListContainer.innerText = 'Please Select Project to Add Tasks'
      return
    }
    id = project_id;
    projects_holder.map(p => {
      if (p.id == id) {
        taskListContainer.innerText = ''
        p.tasks_list.map(t => {
          let { name, id, complete } = t
          value = name;
          taskId = id;
          let divWrapper = document.createElement('div')
          divWrapper.classList.add('taskWrapper');
          let div = document.createElement('div');
          let input = document.createElement('input');
          let h3 = document.createElement('h3');
          let span = document.createElement('span');
          div.classList.add('task');
          complete ? h3.classList.add('task-cleared') : ''
          div.setAttribute('task-id', taskId)
          div.setAttribute('project-id', project_id)
          input.id = 'checkbox'
          input.type = 'checkbox'
          input.name = value;
          input.checked = complete
          h3.classList.add('task-title');
          h3.innerText = value
          h3.contentEditable = true
          span.classList.add('delete-btn');
          span.innerHTML = deleteIconSvg
          div.appendChild(input);
          div.appendChild(h3);
          div.appendChild(span)
          divWrapper.appendChild(div)
          taskListContainer.appendChild(divWrapper)
        })
      }
    })

  }

  let progress = ({ checkboxs, progressBar, taskCounter }) => {
    let ar = Array.from(checkboxs);
    let c = ar.filter(e => e.checked)
    let width = (c.length / ar.length) * 100
    taskCounter.innerText = `${c.length} out of ${ar.length} completed`;
    width = isNaN(width) ? 0 : width
    progressBar.style.width = width + '%';
    progressBar.innerText = Math.round(width) + '%';
  }


  let deleteTask = (e, { projects_holder }, callBack) => {
    if (e.target.parentElement.parentElement.classList.contains('task')) {
      let x = e.target.parentElement.parentElement
      x.parentElement.classList.add('dltTask')
      let projectId = x.getAttribute('project-id');
      let taskId = x.getAttribute('task-id');
      projects_holder.map(p => {
        if (p.id == projectId) {
          p.tasks_list.map((t, i) => {
            if (t.id == taskId) {
              p.tasks_list.splice(i, 1)

            }
          })
        }
      })
      setTimeout(() => {
        x.remove();
        callBack()

      }, 200)
      // callBack()
      // x.remove();

    } else if (e.target.parentElement.parentElement.parentElement.classList.contains('task')) {
      let x = e.target.parentElement.parentElement.parentElement;
      let projectId = x.getAttribute('project-id');
      let taskId = x.getAttribute('task-id');
      x.parentElement.classList.add('dltTask')
      projects_holder.map(p => {
        if (p.id == projectId) {
          p.tasks_list.map((t, i) => {
            if (t.id == taskId) {
              p.tasks_list.splice(i, 1)
            }
          })
        }
      })
      setTimeout(() => {
        x.remove();
        callBack()
      }, 200)
      // callBack()

      // x.remove();

    } else if (e.target.parentElement.parentElement.parentElement.parentElement.classList.contains('task')) {
      let x = e.target.parentElement.parentElement.parentElement.parentElement;
      x.parentElement.classList.add('dltTask')
      let projectId = x.getAttribute('project-id');
      let taskId = x.getAttribute('task-id');
      projects_holder.map(p => {
        if (p.id == projectId) {
          p.tasks_list.map((t, i) => {
            if (t.id == taskId) {
              p.tasks_list.splice(i, 1)
            }
          })
        }
      })
      setTimeout(() => {
        x.remove();
        callBack();
      }, 200)
      // callBack()
      // x.remove();

    }
  }
  let saveTitle = (e, { OldTasktitle, OldProjectTitle, OldProjectDate }, callBack) => {
    e.preventDefault();
    if (e.target.classList.contains('task-title')) {
      OldTasktitle = e.target.textContent;
    } else if (e.target.classList.contains('project-heading')) {
      id = e.target.parentElement.getAttribute('project-id');
      OldProjectTitle = e.target.textContent;
      callBack(id)
    } else if (e.target.classList.contains('project-date')) {
      id = e.target.parentElement.getAttribute('project-id');
      OldProjectDate = e.target.textContent;
      callBack(id)
    }
    // init(projectId);
  }

  let updateTitle = (e, { addTask, projects_holder, OldTasktitle, OldProjectTitle, OldProjectDate }) => {
    e.preventDefault();
    console.log(OldProjectDate, OldProjectTitle)
    console.log(e.target.textContent)
    if (e.target.classList.contains('task-title')) {
      if (OldTasktitle === e.target.textContent) {
        return
      } else {
        if (e.target.parentElement.classList.contains('task')) {
          let id = e.target.parentElement.getAttribute('task-id');
          let projectId = e.target.parentElement.getAttribute('project-id');
          projects_holder.map(p => {
            if (p.id == projectId) {
              p.tasks_list.map(t => {
                if (t.id == id) {
                  if (t.name != e.target.textContent) {
                    t.name = e.target.textContent;
                    toastr.success('Task Title Updated')

                  }
                }
              })
            }
          })

        }
      }
    } else if (e.target.classList.contains('project-heading')) {
      if (OldProjectTitle === e.target.textContent) {
        return
      } else {
        if (e.target.parentElement.classList.contains('project-box')) {
          let projectId = e.target.parentElement.getAttribute('project-id');
          projects_holder.map(p => {
            if (p.id == projectId) {
              if (p.projects_list.name !== e.target.textContent) {
                p.projects_list.name = e.target.textContent;
                toastr.success('Project Title Updated')

              }
            }
          })
        }
      }
    } else if (e.target.classList.contains('project-date')) {
      if (OldProjectTitle === e.target.textContent) {
        return
      } else {

        if (e.target.parentElement.classList.contains('project-box')) {
          let projectId = e.target.parentElement.getAttribute('project-id');
          addTask.setAttribute('project-id', projectId);
          projects_holder.map(p => {
            if (p.id == projectId) {
              if (p.projects_list.date !== e.target.textContent) {
                p.projects_list.date = e.target.textContent
                toastr.success('Project Date Updated')
              }
            }
          })

        }
      }
    }

  }
  let initProjects = ({ projects_holder, taskListContainer, projectsWrapper, modelWrapper, deleteIconSvg }) => {
    if (projects_holder !== '[]') {

      // initilize projects
      taskListContainer.innerText = 'Please Select Project to Add Tasks'
      projects_holder.map(p => {
        let { name, id, date } = p.projects_list;
        let div = document.createElement('div');
        let deleteBtn = document.createElement('div');
        let h3 = document.createElement('h3');
        let span = document.createElement('span');
        div.classList.add('project-box');
        h3.classList.add('project-heading');
        h3.innerText = name
        h3.contentEditable = true
        span.classList.add('project-date');
        span.contentEditable = true
        span.innerText = date
        deleteBtn.classList.add('project-box-delete');
        deleteBtn.innerHTML = deleteIconSvg;
        div.appendChild(h3);
        div.appendChild(span);
        div.appendChild(deleteBtn);
        projectsWrapper.appendChild(div);
        modelWrapper.style.opacity = '0';
        modelWrapper.style.zIndex = '0';
        div.setAttribute('project-id', id)
      })
    }
  }

  let deleteProject = (e, { projects_holder }) => {
    let ans = confirm('Do you want to delete project')
    if (ans) {
      var parents = getParents(e.target.parentElement, '.project-box');
      parents[0].classList.add('dltTask');
      let projectId = parents[0].getAttribute('project-id');
      projects_holder.map((p, i) => {
        if (p.id == projectId) {
          projects_holder.splice(i, 1);
          setTimeout(() => {
            parents[0].remove();
          }, 200)
        }
      })
      toastr.success('project deleted successfully')

    } else {
      toastr.error('project not deleted')
    }
  }

  let createProject = (e, { projects_holder, projectsWrapper, modelWrapper, projects_list, projectNameInput, projectDateInput, deleteIconSvg }) => {
    e.preventDefault();
    let id = 0
    if (projectNameInput != '' && projectDateInput != '') {
      if (projects_holder !== '[]') {
        id = projects_holder.length + 1
      }
      let name = projectNameInput.value
      let date = projectDateInput.value
      projectNameInput.value = ''
      projectDateInput.value = ''
      let div = document.createElement('div');
      let deleteBtn = document.createElement('div');
      let h3 = document.createElement('h3');
      let span = document.createElement('span');
      div.classList.add('project-box');
      h3.classList.add('project-heading');
      h3.innerText = name
      h3.contentEditable = true
      span.classList.add('project-date');
      span.contentEditable = true
      span.innerText = date
      deleteBtn.classList.add('project-box-delete');
      deleteBtn.innerHTML = deleteIconSvg;
      div.appendChild(h3);
      div.appendChild(span);
      div.appendChild(deleteBtn);
      projectsWrapper.appendChild(div);
      modelWrapper.style.opacity = '0';
      modelWrapper.style.zIndex = '0';
      h3.addEventListener('focusout', updateTitle);
      h3.addEventListener('focusin', saveTitle);
      span.addEventListener('focusout', updateTitle);
      span.addEventListener('focusin', saveTitle);
      projects_list = { name, date, id }
      projects_holder.push({ projects_list, tasks_list: [], id })
      div.setAttribute('project-id', id)
      scrollIntoView(div);
      toastr.success('Project Created Successfully')
    }

  }

  let getParents = (elem, selector) => {

    var parents = [];
    var firstChar;
    if (selector) {
      firstChar = selector.charAt(0);
    }

    // Get matches
    for (; elem && elem !== document; elem = elem.parentNode) {
      if (selector) {

        // If selector is a class
        if (firstChar === '.') {
          if (elem.classList.contains(selector.substr(1))) {
            parents.push(elem);
          }
        }

        // If selector is an ID
        if (firstChar === '#') {
          if (elem.id === selector.substr(1)) {
            parents.push(elem);
          }
        }

        // If selector is a data attribute
        if (firstChar === '[') {
          if (elem.hasAttribute(selector.substr(1, selector.length - 1))) {
            parents.push(elem);
          }
        }

        // If selector is a tag
        if (elem.tagName.toLowerCase() === selector) {
          parents.push(elem);
        }

      } else {
        parents.push(elem);
      }

    }

    // Return parents if any exist
    if (parents.length === 0) {
      return null;
    } else {
      return parents;
    }

  };
  return {
    addEventList: function (list, method, type) {
      return addEventListenerToTasks(list, method, type)
    },
    taskCheck: function (e, DOM) {
      return taskCheck(e, DOM)
    },
    addTask: function (DOM) {
      return addTasks(DOM)
    },
    initialTasks: function (project_id, DOM) {
      return initTasks(project_id, DOM);
    },
    progress: function (DOM) {
      return progress(DOM)
    },
    deleteTask: function (e, DOM, callBack) {
      return deleteTask(e, DOM, callBack)
    },
    initProjects: function (DOM) {
      return initProjects(DOM)
    },
    saveTitle: function (e, DOM, callBack) {
      return saveTitle(e, DOM, callBack)
    },
    updateTitle: function (e, DOM) {
      return updateTitle(e, DOM)
    },
    deleteProject: function (e, DOM) {
      return deleteProject(e, DOM)
    },
    createProject: function (e, DOM) {
      return createProject(e, DOM)
    }

  }

})();


// UIview

let UiController = (function () {

  let DOMData = {
    parentElement: document.querySelector('.main-wrapper-left'),
    header: document.querySelector('.main-wrapper-left-header'),
    taskTitle: document.querySelectorAll('.task-title'),
    mainWrapperLeft: document.querySelector('.main-wrapper-left'),
    footer: document.querySelector('.main-wrapper-left-footer'),
    projectsWrapper: document.querySelector('.main-wrapper-left-projects-wrapper'),
    projectBox: document.querySelectorAll('.project-box'),
    checkboxs: document.querySelectorAll('#checkbox'),
    tasks: document.querySelectorAll('.task'),
    projectHeadings: document.querySelectorAll('.project-heading'),
    projectDates: document.querySelectorAll('.project-date'),
    taskCounter: document.querySelector('.task-progress-count'),
    progressBar: document.querySelector('.task-progress-bar-color'),
    addTask: document.querySelector('.add-task'),
    addTaskBtnSvg: document.querySelector('.task-submit-btn svg'),
    addTaskBtn: document.querySelector('.task-submit-btn'),
    deleteTaskBtn: document.querySelectorAll('.delete-btn'),
    deleteProjectBtn: document.querySelectorAll('.project-box-delete'),
    taskListContainer: document.querySelector('.task-list-container'),
    projectCreateBtn: document.querySelector('.project-create-btn'),
    modelWrapper: document.querySelector('.model-wrapper'),
    createBtn: document.querySelector('.create-btn'),
    cancelBtn: document.querySelector('.cancel-btn'),
    projectNameInput: document.querySelector('.project-name-input'),
    projectDateInput: document.querySelector('.project-date-input'),
    deleteIconSvg: `<svg aria-hidden="true" focusable="false" data-prefix="fad" data-icon="trash" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-trash fa-w-14 fa-7x"><g class="fa-group"><path fill="currentColor" d="M53.2 467L32 96h384l-21.2 371a48 48 0 0 1-47.9 45H101.1a48 48 0 0 1-47.9-45z" class="fa-secondary"></path><path fill="currentColor" d="M0 80V48a16 16 0 0 1 16-16h120l9.4-18.7A23.72 23.72 0 0 1 166.8 0h114.3a24 24 0 0 1 21.5 13.3L312 32h120a16 16 0 0 1 16 16v32a16 16 0 0 1-16 16H16A16 16 0 0 1 0 80z" class="fa-primary"></path></g></svg>`,
    projects_list: {},
    tasks_list: [],
    projects_holder: JSON.parse(window.localStorage.getItem('projects_holder')) || [],
    OldTasktitle: '',
    OldProjectTitle: '',
    OldProjectDate: '',
    timerStart: Date.now(),
    mainWrapper: document.querySelector('.main-wrapper'),
    loaderContainer: document.querySelector('.loader-container')
  }

  function handleRes() {
    const addTaskParentElement = DOMData.addTask.getBoundingClientRect().width;
    const parentElementWidth = DOMData.parentElement.getBoundingClientRect().width;
    DOMData.header.style.width = parentElementWidth + 'px';
    DOMData.footer.style.width = parentElementWidth + 'px';
    DOMData.addTaskBtn.style.left = addTaskParentElement + 'px';
  }

  let toggleActive = (e, DOM) => {
    e.stopPropagation();
    DOM.projectBox.forEach(pro => {
      pro.classList.remove('active-project');
    })
    if (!e.target.classList.contains('active-project') && e.target.classList.contains('project-box')) {

      e.target.classList.add('active-project');
    }
    if (!e.target.parentElement.classList.contains('active-project') && e.target.parentElement.classList.contains('project-box')) {
      e.target.parentElement.classList.add('active-project');
    }
  }

  let removeActivePr = (e, DOM) => {
    if(!e.target.classList.contains('project-box') ||  !e.target.parentElement.classList.contains('project-box')){
      DOM.projectBox.forEach(pro => {
        pro.classList.remove('active-project');
      })
    }

  }

  let displayModel = (e, { modelWrapper, createBtn, cancelBtn }) => {
    e.preventDefault();
    modelWrapper.style.opacity = '1';
    modelWrapper.style.zIndex = '11111';

  }
  let cancelModel = (e, { modelWrapper, projectNameInput, projectDateInput }) => {
    e.preventDefault();
    modelWrapper.style.opacity = '0';
    modelWrapper.style.zIndex = '0';
    projectNameInput.value = ''
    projectDateInput.value = ''
  }
  return {
    getDOM: function () {
      return DOMData
    },
    changeFixedElementWidth: function () {
      handleRes();
    },
    toggleActive: function (e, DOM) {
      return toggleActive(e, DOM);
    },
    removeActivePr: function (e, DOM) {
      return removeActivePr(e, DOM);
    },
    displayModel: function (e, DOM) {
      return displayModel(e, DOM)
    },
    cancelModel: function (e, DOM) {
      return cancelModel(e, DOM)
    }

  }
})()


// todo Controller
let Controller = (function (modelCntl, uiCntl) {
  let DOM = uiCntl.getDOM();

  //set up EventListeners
  var setupEventListeners = function () {
    let reFetchData = {
      parentElement: document.querySelector('.main-wrapper-left'),
      header: document.querySelector('.main-wrapper-left-header'),
      taskTitle: document.querySelectorAll('.task-title'),
      footer: document.querySelector('.main-wrapper-left-footer'),
      projectsWrapper: document.querySelector('.main-wrapper-left-projects-wrapper'),
      projectBox: document.querySelectorAll('.project-box'),
      checkboxs: document.querySelectorAll('#checkbox'),
      tasks: document.querySelectorAll('.task'),
      projectHeadings: document.querySelectorAll('.project-heading'),
      projectDates: document.querySelectorAll('.project-date'),
      taskCounter: document.querySelector('.task-progress-count'),
      progressBar: document.querySelector('.task-progress-bar-color'),
      addTask: document.querySelector('.add-task'),
      addTaskBtnSvg: document.querySelector('.task-submit-btn svg'),
      addTaskBtn: document.querySelector('.task-submit-btn'),
      deleteTaskBtn: document.querySelectorAll('.delete-btn'),
      deleteProjectBtn: document.querySelectorAll('.project-box-delete'),
      projects_list: {},
      tasks_list: [],
    }

    DOM = Object.assign(DOM, reFetchData);
    DOM.addTaskBtn.addEventListener('click', addTasks)
    DOM.addTask.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        event.stopImmediatePropagation();
        // Do more work
        addTasks(event);
      }
    });
    document.addEventListener("DOMContentLoaded", () => ready(DOM.loaderContainer, DOM.mainWrapper, DOM.timerStart));
    modelCntl.addEventList(DOM.checkboxs, taskCheck);
    modelCntl.addEventList(DOM.deleteProjectBtn, deleteProject);
    modelCntl.addEventList(DOM.projectBox, toggleActive);
    modelCntl.addEventList(DOM.deleteTaskBtn, deleteTask);
    // modelCntl.addEventList(DOM.projectCreateBtn, displayModel);
    DOM.projectCreateBtn.addEventListener('click', displayModel)
    DOM.createBtn.addEventListener('click', createProject)
    DOM.cancelBtn.addEventListener('click', cancelModel)
    DOM.mainWrapperLeft.addEventListener('click', removeActivePr)
    modelCntl.addEventList(window, updateRes, ['load', 'resize']);
    modelCntl.addEventList(DOM.taskTitle, [updateTitle, saveTitle], ['focusout', 'focusin']);
    modelCntl.addEventList(DOM.projectDates, [updateTitle, saveTitle], ['focusout', 'focusin']);
    modelCntl.addEventList(DOM.projectHeadings, [updateTitle, saveTitle], ['focusout', 'focusin']);
    // modelCntl.addEventList(DOM.addTask, [activateAddBtn, deActivateAddBtn], ['focousin', 'focusout'])

    DOM.addTask.addEventListener('focusin', activateAddBtn);
    DOM.addTask.addEventListener('focusout', deActivateAddBtn);
    window.localStorage.setItem('projects_holder', JSON.stringify(DOM.projects_holder));
    modelCntl.progress(DOM)
  }
  //init projects
  modelCntl.initProjects(DOM);
  //init Tasks



  let ready = function (loaderCont, mainWrap, timerStart) {
    setTimeout(() => {
      loaderCont.classList.add('fadeout');
      mainWrap.classList.remove('fadeout');
    }, ((Date.now() - timerStart) + 150 + (Date.now() - timerStart)) * 10)
  }

  let taskCheck = function (e) {
    modelCntl.taskCheck(e, DOM)
    setupEventListeners()
  }
  let addTasks = function () {
    modelCntl.addTask(DOM)
    setupEventListeners();

  }
  let removeActivePr = function (e) {
    uiCntl.removeActivePr(e,DOM)
    DOM.addTask.setAttribute('project-id', null)
    modelCntl.initialTasks(null, DOM)
  }
  let displayModel = (e) => {
    uiCntl.displayModel(e, DOM)
  }
  let cancelModel = (e) => {
    uiCntl.cancelModel(e, DOM)
  }
  let deleteProject = function (e) {
    modelCntl.deleteProject(e, DOM)
    setupEventListeners()
  }
  let updateTitle = function (e) {
    modelCntl.updateTitle(e, DOM)
    setupEventListeners()
  }
  let saveTitle = function (e) {
    modelCntl.saveTitle(e, DOM, (projectId) => {
      modelCntl.initialTasks(projectId, DOM)
    })
  }
  let toggleActive = function (e) {
    uiCntl.toggleActive(e, DOM)
    let id = e.target.getAttribute('project-id')
  if(e.target.parentElement.classList.contains('project-box')){
    id = e.target.parentElement.getAttribute('project-id')
  }
    DOM.addTask.setAttribute('project-id', id)
    modelCntl.initialTasks(id, DOM)
    setupEventListeners();
  }
  let deleteTask = function (e) {
    modelCntl.deleteTask(e, DOM, () => {
      toastr.success('Task Deleted')
      setupEventListeners()
    })

  }

  let updateRes = function () {
    uiCntl.changeFixedElementWidth();
  }

  let activateAddBtn = (e) => {
    e.preventDefault();
    DOM.addTaskBtnSvg.style.color = '#0984e3';
  }
  let deActivateAddBtn = (e) => {
    e.preventDefault();
    DOM.addTaskBtnSvg.style.color = '#b2bec3';
  }
  let createProject = (e) => {
    modelCntl.createProject(e, DOM)
    setupEventListeners()
  }
  return {
    init: function () {
      console.log('Application has been started');
      setupEventListeners();
      modelCntl.progress(DOM)

    }
  }

})(modelController, UiController)

Controller.init();

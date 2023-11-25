const form = document.querySelector(".registration-form");
const formEmail = document.querySelector("#email");
const formFio = document.querySelector("#fio");
const formPassword = document.querySelector("#password");
const formPasswordConfirm = document.querySelector("#password-second");
const formCheck = document.querySelector("#check");
const divCheck = document.querySelector(".reg-check");
const labelCheck = document.querySelector(".check-registration");
const formBtn = document.querySelector(".form-button");
const maxEmailLength = 100;
const maxFioLength = 150;
const maxPasswordLength = 30;
const minPasswordLength = 8;

let arrayOfErrors = {
  minLength: "Минимальная длина field length символов",
  maxLength: "Максимальная длина field length символов",
  isEmpty: "Поле должно быть заполнено",
  passwordCheck: "В пароле должен содержаться хотя бы один не буквенный символ",
  formOfEmail: "Почта должна иметь формат xxx@xxx.xx",
  passwordConfirm: "Пароли должны совпадать",
  checkedRegistration: "Необходимо подтвердить регистрацию",
};

let isEmpty = (field) => (field.value.trim() == "" ? true : false);

let isTooLong = (str, maxLength) =>
  str.value.trim().length > maxLength ? true : false;

let isTooShort = (str, minLength) =>
  str.value.trim().length < minLength ? true : false;

let checkPatternEmail = () => {
  const patternEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return patternEmail.test(formEmail.value);
};
let checkPatternPassword = () => {
  const patternPassword = /[^a-zA-Z]/;
  return patternPassword.test(formPassword.value);
};

let isPasswordSimilar = (password1, password2) =>
  password1.value.trim() == password2.value.trim() ? true : false;

formBtn.addEventListener("click", removeErrors);
formBtn.addEventListener("click", validationForm);

function replaceElem(field, lengthOfField, length) {
  let str = arrayOfErrors[length].replace("length", lengthOfField);
  str = str.replace("field", field);
  return str;
}

function removeErrors(event) {
  event.preventDefault();
  let errorElement = document.querySelectorAll(
    ".registration-form__input-error"
  );
  let errorMessages = document.querySelectorAll(".registration-form__error");
  errorMessages.forEach((element) => element.remove());
  errorElement.forEach((element) =>
    element.classList.remove("registration-form__input-error")
  );
}

function addErrorInHTML(formInput, errorType, changingPar) {
  if (!formInput.classList.contains("registration-form__input-error"))
    formInput.classList.add("registration-form__input-error");

  if (changingPar) {
    formInput.insertAdjacentHTML(
      "afterend",
      `<span class="registration-form__error">${changingPar}</span>`
    );
  } else {
    formInput.insertAdjacentHTML(
      "afterend",
      `<span class="registration-form__error">${arrayOfErrors[errorType]}</span>`
    );
  }
}

function validateEmail() {
  if (isEmpty(formEmail)) {
    addErrorInHTML(formEmail, "isEmpty");
  } else if (checkPatternEmail()) {
    if (isTooLong(formEmail, maxEmailLength)) {
      addErrorInHTML(
        formEmail,
        "formOfEmail",
        replaceElem("почты", maxEmailLength, "maxLength")
      );
    } else return true;
  } else {
    addErrorInHTML(formEmail, "formOfEmail");
    if (isTooLong(formEmail, maxEmailLength)) {
      addErrorInHTML(
        formEmail,
        "formOfEmail",
        replaceElem("почты", maxEmailLength, "maxLength")
      );
    }
  }

  return false;
}

function validateFio() {
  if (isEmpty(formFio)) {
    addErrorInHTML(formFio, "isEmpty");
  } else if (isTooLong(formFio, maxFioLength)) {
    addErrorInHTML(
      formFio,
      "maxLength",
      replaceElem("ФИО", maxFioLength, "maxLength")
    );
  } else return true;

  return false;
}

function validatePassword() {
  if (isEmpty(formPassword)) {
    addErrorInHTML(formPassword, "isEmpty");
    addErrorInHTML(formPasswordConfirm, "isEmpty");
  } else if (!isEmpty(formPassword) && isEmpty(formPasswordConfirm)) {
    console.log(isTooShort(formPassword));
    if (isTooShort(formPassword, minPasswordLength)) {
      addErrorInHTML(
        formPassword,
        "minLength",
        replaceElem("пароля", minPasswordLength, "minLength")
      );
      console.log("я тут");
    } else if (isTooLong(formPassword, maxPasswordLength)) {
      addErrorInHTML(
        formPassword,
        "minLength",
        replaceElem("пароля", maxPasswordLength, "maxLength")
      );
    }
    addErrorInHTML(formPasswordConfirm, "isEmpty");
  } else if (!isEmpty(formPassword) && !isEmpty(formPasswordConfirm)) {
    let pass = 0;
    if (isTooShort(formPassword, minPasswordLength)) {
      pass = 1;
      addErrorInHTML(
        formPassword,
        "minLength",
        replaceElem("пароля", minPasswordLength, "minLength")
      );
      formPasswordConfirm.classList.add("registration-form__input-error");
    } else if (isTooLong(formPassword, maxPasswordLength)) {
      pass = 1;
      addErrorInHTML(
        formPassword,
        "minLength",
        replaceElem("пароля", maxPasswordLength, "maxLength")
      );
      formPasswordConfirm.classList.add("registration-form__input-error");
    }
    if (checkPatternPassword() && pass == 0) {
      if (isPasswordSimilar(formPassword, formPasswordConfirm)) {
        return true;
      } else {
        formPassword.classList.add("registration-form__input-error");
        addErrorInHTML(formPasswordConfirm, "passwordConfirm");
      }
    } else {
      formPasswordConfirm.classList.add("registration-form__input-error");
      addErrorInHTML(formPassword, "passwordCheck");
    }
  }
  return false;
}

function validatePermission() {
  if (!formCheck.checked) {
    addErrorInHTML(divCheck, "checkedRegistration");
  } else return true;
  return false;
}

function validationForm(event) {
  event.preventDefault();
  passPassword = validatePassword();
  passFio = validateFio();
  passEmail = validateEmail();
  passPermission = validatePermission();
  if (passPassword && passFio && passEmail && passPermission) {
    localStorage.setItem("email", formEmail.value);
    localStorage.setItem("fio", formFio.value);
    localStorage.setItem("password", formPassword.value);
    form.insertAdjacentHTML(
      "beforebegin",
      `<h2 class="success-reg">Вы успешно создали аккаунт!</h2>`
    );
    form.remove();
  }
}

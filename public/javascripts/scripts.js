const phoneInputField = document.querySelector('#phone');
const phoneInput = window.intlTelInput(phoneInputField, {
  initialCountry: 'auto',
  geoIpLookup: getIp,
  utilsScript:
    'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js',
});

function getIp(callback) {
  fetch('https://ipinfo.io/json?token=2997d36693a5ef', {
    headers: { Accept: 'application/json' },
  })
    .then((resp) => resp.json())
    .catch(() => {
      return {
        country: 'us',
      };
    })
    .then((resp) => callback(resp.country));
}

const phone = document.querySelector('#phone');
const phoneCode = document.querySelector('#phoneCode');

phone.addEventListener('input', updateValue);

function updateValue(e) {
  const phoneNumber = phoneInput.getNumber();
  // info.style.display = "";
  phoneCode.value = `${phoneNumber}`;
}

$.ajaxSetup({
  headers: {
    'x-auth-token': window.localStorage.jwt,
  },
});

$(document).ready(function () {
  $('#create-school').submit(function (event) {
    var formData = {
      schoolId: $('#id').val(),
      name: $('#name').val(),
      phone: $('#phone').val(),
      module: $('#module').val(),
      subscriptionDate: $('#subscriptionDate').val(),
    };

    $.ajax({
      type: 'POST',
      url: 'http://localhost:3000/schools',
      data: formData,
      dataType: 'json',
      encode: true,
    })
      .done(function (data) {
        console.log(data);

        $('#form-error').html(`<div class="alert alert-success">Success</div>`);
      })
      .fail(function (error) {
        console.log(error);
        $('#form-error').html(
          `<div class="alert alert-danger">${error.responseText}</div>`
        );
      });

    event.preventDefault();
  });
});

$(document).ready(function () {
  $('#update-school').submit(function (event) {
    var formData = {
      schoolId: $('#updateid').val(),
      name: $('#updatename').val(),
      phone: $('#updatephone').val(),
      module: $('#updatemodule').val(),
      subscriptionDate: $('#updatesubscriptionDate').val(),
      subscriptionPassword: $('#subscriptionPassword').val(),
    };

    let id = $('#_id').val();

    $.ajax({
      type: 'PUT',
      url: `http://localhost:3000/schools/${id}`,
      data: formData,
      dataType: 'json',
      encode: true,
    })
      .done(function (data) {
        console.log(data);

        $('#update-form-error').html(
          `<div class="alert alert-success">Success</div>`
        );
      })
      .fail(function (error) {
        console.log(error);
        $('#update-form-error').html(
          `<div class="alert alert-danger">${error.responseText}</div>`
        );
      });

    event.preventDefault();
  });
});

$(document).ready(function () {
  $('#create-user').submit(function (event) {
    var formData = {
      name: $('#name').val(),
      username: $('#username').val(),
      password: $('#password').val(),
      isAdmin: $('#isAdmin').val(),
    };

    $.ajax({
      type: 'POST',
      url: `http://localhost:3000/users`,
      data: formData,
      dataType: 'json',
      encode: true,
    })
      .done(function (data) {
        console.log(data);

        $('#form-error').html(`<div class="alert alert-success">Success</div>`);
      })
      .fail(function (error) {
        console.log(error);
        $('#form-error').html(
          `<div class="alert alert-danger">${error.responseText}</div>`
        );
      });

    event.preventDefault();
  });
});

$(document).ready(function () {
  $('.table').each(function (_, table) {
    $(table).DataTable();
  });
});

function viewSchool(id) {
  $.get({
    url: `/schools/${id}`,
  })
    .done(function (data) {
      console.log(data);
      $('#updateSch-modal').modal('show');
      document.querySelector('#_id').value = data._id;
      document.querySelector('#updateid').value = data.schoolId;
      document.querySelector('#updatename').value = data.name;
      document.querySelector('#updatephone').value = data.phone;
      document.querySelector('#updatemodule').value = data.module;
      document.querySelector('#date-label').innerHTML =
        'Expiry Date: ' +
        data.subscriptionDate.toLocaleString('en-GB', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        });
    })
    .fail(function (error) {
      console.log(error);
    });

  event.preventDefault();
}

function generatePassword() {
  let chars =
    '01234456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let passwordLength = 12;
  let password = '';

  for (let i = 0; i <= passwordLength; i++) {
    let randomNumber = Math.floor(Math.random() * chars.length);
    password += chars.substring(randomNumber, randomNumber + 1);
  }

  document.querySelector('#subscriptionPassword').value = password;
}

function copyPassword() {
  let copyText = document.getElementById('subscriptionPassword');
  copyText.select();
  document.execCommand('copy');
}

function logout() {
  window.localStorage.setItem('jwt', '');

  window.location.href = '/';
}

function addUser() {
  $('#addUser-modal').modal('show');
}

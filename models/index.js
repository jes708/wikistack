var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/wikistack');

var Page = db.define('page', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    urlTitle: {
        type: Sequelize.STRING,
        allowNull: false
    },
    content: {
        type: Sequelize.STRING,
        allowNull: false
    },
    tags: {
        type: Sequelize.ARRAY(Sequelize.TEXT)
    },
    status: {
        type: Sequelize.ENUM('open', 'closed')
    },
    date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    }
}, {
  hooks: {
   beforeValidate: function (page) {
     if (page.title) {
        page.urlTitle = page.title.replace(/\s+/g, "_").replace(/\W+/g, "");
      } 
      else {
        page.title = Math.random().toString(36).substring(2, 7);
        page.urlTitle = Math.random().toString(36).substring(2, 7);
      }
    }
  },

  getterMethods: {
    route: function() {return '/wiki/' + this.urlTitle;}
  }
});

var User = db.define('user', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        isEmail: true
    }
});

// User.hasMany(Page, {as: 'author'});
Page.belongsTo(User, {as: 'author'});

module.exports = {
  Page: Page,
  User: User
};

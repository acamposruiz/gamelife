'use strict';

import _ from 'lodash';
import * as algorithm from './algorithm';

function Canvas() {};

Canvas.colors = {

  dead: '#242424',
  trail: ['#2E2E2E'],
  alive: ['#FF39E1', '#E131C7']

};

Canvas.prototype.init = function init() {

  this.canvas = document.getElementById('gameOfLife');
  this.context = this.canvas.getContext('2d');

  this.cellSize = 8; //4
  this.cellSpace = 1; //1
  this.rows = window.innerHeight / (this.cellSize + this.cellSpace); //86
  this.columns = window.innerWidth / (this.cellSize + this.cellSpace); //180

  this.clearWorld();

  return this;

};

Canvas.prototype.getElement = function getElement() {

  return this.canvas;

};

Canvas.prototype.clearWorld = function clearWorld() {

  // Init ages (Canvas reference)
  this.age = [];

  _.forEach(_.range(this.columns), (i) => {

    this.age[i] = [];

    _.forEach(_.range(this.rows), (j) => {


      this.age[i][j] = 0; // Dead

    });

  });

  return this;

};

Canvas.prototype.freeDraw = function(e, state) {

  let x;
  let y;

  if (e.pageX || e.pageY) {

    x = e.pageX;
    y = e.pageY;

  } else {

    x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;

  }

  x -= this.canvas.offsetLeft;
  y -= this.canvas.offsetTop;

  x = Math.floor(x / (this.cellSize + this.cellSpace));
  y = Math.floor(y / (this.cellSize + this.cellSpace));

  // console.log(x, y);

  const newState = algorithm.switchToAlive(x, y, state);

  // console.log(newState);

  this.changeCelltoAlive(x, y);

  return newState;

};

Canvas.prototype.drawWorld = function drawWorld(state) {

  // Dynamic canvas size
  // this.width = 1 + (this.cellSpace * this.columns) + (this.cellSize * this.columns);
  this.width = window.innerWidth;
  this.canvas.setAttribute('width', this.width);

  // this.height = 1 + (this.cellSpace * this.rows) + (this.cellSize * this.rows);
  this.height = window.innerHeight;
  this.canvas.setAttribute('height', this.height);

  window.addEventListener('resize', () => {

    // this.drawWorld(state);

  });

  // Fill background
  this.context.fillStyle = '#242424';
  this.context.fillRect(0, 0, this.width, this.height);

  _.forEach(_.range(this.columns), (i) => {

    _.forEach(_.range(this.rows), (j) => {

      if (algorithm.isAlive(i, j, state)) {

        this.drawCell(i, j, true);

      } else {

        this.drawCell(i, j, false);

      }

    });

  });

};

Canvas.prototype.drawCell = function drawCell(i, j, alive) {

  if (alive) {

    if (this.age[i][j] > -1) this.context.fillStyle = Canvas.colors.alive[this.age[i][j] % Canvas.colors.alive.length];

  } else {

    if (this.age[i][j] < 0) {

      this.context.fillStyle = Canvas.colors.trail[(this.age[i][j] * -1) % Canvas.colors.trail.length];

    } else {

      this.context.fillStyle = Canvas.colors.dead;

    }

  }

  // this.context.beginPath();
  this.context.fillRect(this.cellSpace + (this.cellSpace * i) + (this.cellSize * i), this.cellSpace + (this.cellSpace * j) + (this.cellSize * j), this.cellSize, this.cellSize);
  // this.context.stroke();

};

Canvas.prototype.switchCell = function switchCell(i, j) {

  if (algorithm.isAlive(i, j)) {

    this.changeCelltoDead(i, j);
    algorithm.switchToDead(i, j);

  } else {

    this.changeCelltoAlive(i, j);
    algorithm.switchToAlive(i, j);

  }

};

Canvas.prototype.keepCellAlive = function keepCellAlive(i, j) {

  if (i >= 0 && i < this.columns && j >= 0 && j < this.rows) {

    this.age[i][j]++;
    this.drawCell(i, j, true);

  }

};

Canvas.prototype.changeCelltoAlive = function changeCelltoAlive(i, j) {

  if (i >= 0 && i < this.columns && j >= 0 && j < this.rows) {

    this.age[i][j] = 1;
    this.drawCell(i, j, true);

  }

};

Canvas.prototype.changeCelltoDead = function changeCelltoDead(i, j) {

  if (i >= 0 && i < this.columns && j >= 0 && j < this.rows) {

    this.age[i][j] = -this.age[i][j]; // Keep trail
    this.drawCell(i, j, false);

  }

};

// Singleton OOP
export
default new Canvas();
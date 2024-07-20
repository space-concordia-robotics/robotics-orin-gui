import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import {STLLoader} from 'three/examples/jsm/loaders/STLLoader'
import Stats from 'three/examples/jsm/libs/stats.module'
import { ConnectionInfoService } from '../services/connection-info.service';

@Component({
  selector: 'app-arm',
  standalone: true,
  imports: [],
  templateUrl: './arm.component.html',
  styleUrl: './arm.component.css'
})

export class ArmComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas', {static: true}) canvasRef: ElementRef<HTMLCanvasElement>
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private stats: Stats;

  constructor (private connectionInfoService: ConnectionInfoService) {
  }
  
  ngOnInit(): void {
    this.initThreeJS();
    this.loadModel();
  }

  ngAfterViewInit(): void {
    this.animate()
  }

  private initThreeJS(): void {
    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xddddff);

    // Camera
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 10;
    this.camera.position.x = 8;
    this.camera.position.y = 3;


    // Renderer
    const canvas = this.canvasRef.nativeElement;
    this.renderer = new THREE.WebGLRenderer({ canvas });
    this.renderer.setSize( window.innerWidth, window.innerHeight)
    this.renderer.setAnimationLoop(this.animate)
    document.body.appendChild(this.renderer.domElement)

    // Orbital controls, allows the camera to orbit around a target
    new OrbitControls(this.camera, this.renderer.domElement);

    // Stats panel, useful for seeing the performance
    this.stats = new Stats()
    document.body.appendChild(this.stats.dom)

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 200); // Soft white light

    this.scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 100); // White directional light
    directionalLight.position.set(-5, 10, 7.5);
    this.scene.add(directionalLight);
  }

  private loadModel(): void {
    this.connectionInfoService.getServerURL().then(serverURL => {

      const material = new THREE.MeshStandardMaterial({
        color: 0x888888,
        metalness: 1.0,
        roughness: 0.2
      })

      const loader = new STLLoader();
      loader.load(
        `${serverURL}/meshes/base_link.STL`,
        (geometry) => {
          geometry.computeVertexNormals();
          const base_link = new THREE.Mesh(geometry, material)

          base_link.scale.set(10, 10, 10);
          base_link.rotation.x = -Math.PI / 2;
          base_link.position.y = -2

          this.scene.add(base_link)
        },
        (xhr) => {
          console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
        },
        (error) => {
          console.log(error)
        }
      )
      loader.load(
        `${serverURL}/meshes/upper_base_link.STL`,
        (geometry) => {
          const upper_base_link = new THREE.Mesh(geometry, material)

          upper_base_link.scale.set(10, 10, 10);
          upper_base_link.rotation.x = -Math.PI / 2;
          upper_base_link.position.y = -0.55;

          this.scene.add(upper_base_link)
        },
        (xhr) => {
          console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
        },
        (error) => {
          console.log(error)
        }
      )
      loader.load(
        `${serverURL}/meshes/proximal_link.STL`,
        (geometry) => {
          const proximal_link = new THREE.Mesh(geometry, material)

          proximal_link.scale.set(10, 10, 10);
          proximal_link.rotation.z = 5 * Math.PI / 8;
          proximal_link.position.y = -0.5

          this.scene.add(proximal_link)
        },
        (xhr) => {
          console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
        },
        (error) => {
          console.log(error)
        }
      )
      loader.load(
        `${serverURL}/meshes/distal_link.STL`,
        (geometry) => {
          const distal_link = new THREE.Mesh(geometry, material)

          distal_link.scale.set(10, 10, 10);
          distal_link.rotation.z = Math.PI / 8;
          distal_link.position.y = 3.3; // TODO: This should be dynamically calculated
          distal_link.position.x = -1.6; // TODO: This should be dynamically calculated

          this.scene.add(distal_link)
        },
        (xhr) => {
          console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
        },
        (error) => {
          console.log(error)
        }
      )
      loader.load(
        `${serverURL}/meshes/wrist.STL`,
        (geometry) => {
          const wrist = new THREE.Mesh(geometry, material)

          wrist.scale.set(10, 10, 10);
          wrist.position.y = 4.85; // TODO: This should be dynamically calculated
          wrist.position.x = 2.2;
          this.scene.add(wrist)
        },
        (xhr) => {
          console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
        },
        (error) => {
          console.log(error)
        }
      )
    })
  }

  private animate(): void {
    requestAnimationFrame(() => this.animate());
    this.renderer.render( this.scene, this.camera);
    this.stats.update();
  }
}

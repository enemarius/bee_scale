# bee_scale
Bee hive scale

## Getting Started


### Prerequisites


```

```

## Links

* [Sparkfun](https://learn.sparkfun.com/tutorials/getting-started-with-load-cells) - Getting Started with Load Cells
* [Sparkfun](https://learn.sparkfun.com/tutorials/load-cell-amplifier-hx711-breakout-hookup-guide) - Load Cell Amplifier HX711 Breakout Hookup Guide 
* [Wikipedia](https://en.wikipedia.org/wiki/Wheatstone_bridge) - Wheatstone bridge


### Hookup guide

	HX711 board pinout:
	- E+			GND -
	- E-			DT  -
	- A-			SCK -
	- A+			VCC -
	- B-
	- B+

	VCC - 2.7 ~ 5.5V
	On-chip analog supply regulator is not used ? (VSUP connected to DVDD)
	XI=GND   => Internal oscillator used.
	RATE=GND => Output data rate control, 0: 10Hz	
	
	J1 header					Load cell
	---------------------------------------------------
	E+ is VCC (excitation +)	
	E- is GND (excitation -)	
	A- is Output signal -
	A+ is Output signal +
	
	Load cell
	---------------------------------------------------
	WHITE <-> RED    ~ 1K, constant
	RED   <-> BLACK  ~ 1K, changes with applied force
	WHITE <-> BLACK  ~ 2K, sum of previous two pairs
	RED is center tap.
	
	
## Software aspects

### HX711 - pin aspects
	
	When output data is not ready for retrieval, digital output pin DOUT is high. Serial clock
	input PD_SCK should be low. When DOUT goes to low, it indicates data is ready for retrieval. By
	applying 25~27 positive clock pulses at the PD_SCK pin, data is shifted out from the DOUT
	output pin. Each PD_SCK pulse shifts out one bit, starting with the MSB bit first, until all 24 bits are
	shifted out. The 25th pulse at PD_SCK input will pull DOUT pin back to high
	
	Input and gain selection is controlled by the number of the input PD_SCK pulses:
	PD_SCK Pulses |	Input channel |	Gain
	------------------------------------
	25 			  |	A 			  |	128
	26 			  |	B 			  |	 32
	27 			  |	A 			  |	 64

	When PD_SCK Input is low, chip is in normal working mode.
	When PD_SCK pin changes from low to high and stays at high for longer than 60μs, HX711 enters power down mode
	After a reset or power-down event, input selection is default to Channel A with a gain of 128.

### HX711 - software aspects	
	
	```
	sbit ADDO = P1^5;
	sbit ADSK = P0^0;
	unsigned long ReadCount(void){
		unsigned long Count;
		unsigned char i;
		ADDO=1;
		ADSK=0;
		Count=0;
		while(ADDO);
		for (i=0;i<24;i++){
			ADSK=1;
			Count=Count<<1;
			ADSK=0;
			if(ADDO) Count++;
		}
		ADSK=1;
		Count=Count^0x800000;
		ADSK=0;
		return(Count);
	}
	```	
	
	
## Author

* **Marius Ene** - *Initial work*	[enemarius](https://github.com/enemarius)






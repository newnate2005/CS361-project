# CS361-project - Microservice For Elijah Hamlin

# Communication Contract
## Starting microservice:
To start using the microservice you need to first run add.py. This can be accomplished through your IDE run functionality or through "python add.py" on the command line. Then on a separate terminal or instance of run, run your program that will request and recieve data from the microservice. 

## How to programmatically request data:
To request data from the microservice your program will be writing to operation.txt. The first line should be the operation "add", the second line should be the numbers to be added (separated by a space), and the third line should be false or true depending on if the result should be rounded. 

Example:
```
def send_input(nums, roundResult):
    with open("operation.txt", "w") as file:
        file.write(f"{"add"}\n" + " ".join(map(str, nums)) + f"\n{roundResult}")
```
## How to programmatically receive data:
To receive the data your program just needs to wait for a second or two then look in result.txt where the result of the computation is stored.

Example:
```
def read_result():
    while True:
        try:
            with open("result.txt", "r") as file:
                calc = file.read().strip()

                if calc:
                    return calc

        except FileNotFoundError:
            pass

        time.sleep(2)
```
